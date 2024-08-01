import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Context, Telegraf, Markup, session, Scenes } from "telegraf";
import { UsersService } from "../users/users.service";
import { ClientsService } from "../clients/clients.service";
import { ProductItemsService } from "../product-items/product-items.service";
import { CitiesService } from "../cities/cities.service";
import { ProductItems } from "../product-items/product-item.entity/product-item.entity";
import { MyWebSocketGateway } from "../core/websocket.gateway";

// export interface MyContext extends Context {
//   scene: Scenes.SceneContextScene<MyContext>;
// }

export interface MyContext extends Scenes.SceneContext {}
@Injectable()
export class TelegramService {
  constructor(
    @Inject(forwardRef(() => ProductItemsService))
    private readonly productService: ProductItemsService,
    private readonly clientService: ClientsService,
    private readonly cityService: CitiesService,
    private readonly webSocketGateway: MyWebSocketGateway
  ) {
    this.bot = new Telegraf('6636125148:AAFp6741W-FJd15CQ2M0cpfbLVSs6z3u0V0');

    const registerContactScene = new Scenes.BaseScene<any>('registerContact');

    registerContactScene.enter(async (ctx) => {
      console.log('ccc', ctx.message.text)
      const userId = ctx.from.id;
      const existingClient = await this.clientService.findByChatId(userId);

      if (existingClient) {
        ctx.session.clientId = existingClient.id;
        ctx.reply('Вы были зарегистрированы. Далее просим Вас выбрать услугу:');
        // await ctx.reply('Пожалуйста поделитесь контаком', Markup.keyboard([
        //   [{ text: "List Orders", callback_data: "list_orders" }],
        //   [{ text: "Enter New Order", callback_data: "enter_new_order" }]
        // ]).resize());

        await ctx.reply('Выберите', Markup.keyboard([
          ["Новый заказ", "Список Заказов"],
          ["☸ Настройки", "📞 Обратная связь"],
          ["⭐️ Оцените нас", "👥 Поделиться"],
        ]).oneTime().resize());
        // ctx.scene.enter('provideOrderId');

      } else {
        ctx.reply('' +
          'Здравствуйте!\n\n ' +
          'Вы обратились в логистическую компанию Golden Gate Cargo. Мы занимаемся доставкой посылок из Китая.\n\n' +
          'Наш адрес в Китае:\n' +
          '浙江省金华市义乌市陶界岭70栋2单元店面俄罗斯物流, 天龙15899119986\n\n' +
          'Если Вы хотите воспользоваться услугами нашего Карго, просим Вас поделиться Вашим контактом 🙂');

        ctx.reply('', Markup.keyboard([[{
          text: "Поделиться контактом",
          request_contact: true
        }]]).resize());
      }
    });

    this.bot.command('stop',  async (ctx: any) => {
      await ctx.reply('Пока', Markup.keyboard([
        ["Запустить"],
      ]).oneTime().resize());
    })

    // bot.hears("🔍 Search", ctx => ctx.reply("Yay!"));


    // registerContactScene.action("stop", async (ctx: any) => {
    //   await ctx.scene.leave();
    //   await ctx.reply("You have stopped the conversation.");
    // });

    registerContactScene.on('text', async ctx => {
      if (ctx.message.text.trim() === '/start') {
        await ctx.scene.enter('registerContact');
        return;
      }

      if (ctx.message.text.trim() === '/stop') {
        await ctx.reply('Пока', Markup.keyboard([
          ["Запустить"],
        ]).oneTime().resize());
        return;
      }

      if (ctx.message.text.trim() === 'Запустить') {
        await ctx.scene.enter('registerContact');
        return;
      }

      if (ctx.message.text.trim() === '🔍 Поиск') {
        await ctx.reply('Выберите', Markup.keyboard([
          ["Назад"],
        ]).oneTime().resize());
        return;
      }

      if (ctx.message.text.trim() === 'Назад') {
        await ctx.scene.enter('registerContact');
        return;
      }

      if (ctx.message.text.trim() === 'Список Заказов') {
        // await ctx.reply('Выберите', Markup.keyboard([
        //   ["Назад"],
        // ]).oneTime().resize());
        await ctx.scene.enter('orderListScene');
        return;
      }

      if (ctx.message.text.trim() === 'Новый заказ') {
        await ctx.scene.enter('cityListSceneId');
        return;
      }

      // await ctx.reply('Пожалуйста поделитесь контаком', Markup.keyboard([[{
      //   text: "Register",
      //   request_contact: true
      // }]]).resize());
    });

    const citySelectScene = new Scenes.BaseScene<any>('cityListSceneId');
    citySelectScene.enter(async ctx => {
      const chatId = ctx.message.chat.id;
      const cities = await this.cityService.findAll();
      const buttons = cities.map(city => Markup.button.callback(city.name, `city_${city.id}`));
      buttons.push(Markup.button.callback("Назад", "back"));
      const keyboard = Markup.inlineKeyboard(buttons, { columns: 2 });
      await ctx.reply('Пожалуйста, выберите Ваш город:', keyboard);
    });

    citySelectScene.on('text', async ctx => {
      if (ctx.message.text.trim() === '/start') {
        await ctx.scene.enter('registerContact');
        return;
      }

      if (ctx.message.text.trim() === '/stop') {
        await ctx.reply('Пока', Markup.keyboard([
          ["Запустить"],
        ]).oneTime().resize());
        return;
      }

      await ctx.scene.enter('cityListSceneId');
    });

    citySelectScene.action(/city_/, async (ctx: any) => {
      const cityId = ctx.callbackQuery.data.split('_')[1];
      ctx.session.cityId = cityId;
      await ctx.scene.enter('nameEnterSceneId');
    });

    citySelectScene.action(/back/, async (ctx: any) => {
      await ctx.scene.enter('registerContact');
    });

    const nameEnterScene = new Scenes.BaseScene<any>('nameEnterSceneId');
    nameEnterScene.enter(async ctx => ctx.reply('Укажите разновидность товара (одежда, мягкие игрушки, хозяйственные товары и др.):'));

    nameEnterScene.on('text', async ctx => {
      const name = ctx.message.text;

      if (!name.length) {
        ctx.scene.enter('nameEnterSceneId');
        return;
      }

      if (name === '/start') {
        await ctx.scene.enter('registerContact');
        return;
      }

      if (name === '/stop') {
        await ctx.reply('Пока', Markup.keyboard([
          ["Запустить"],
        ]).oneTime().resize());
        return;
      }

      if (name === 'Назад') {
        await ctx.scene.enter('registerContact');
        return;
      }

      ctx.session.name = name;

      ctx.scene.enter('provideOrderId');
    });

    const orderListScene = new Scenes.BaseScene<any>('orderListScene');
    orderListScene.enter(async ctx => {
      const chatId = ctx.message.chat.id;
      const user = await this.clientService.findByChatId(chatId);
      const list = await this.productService.findByChatId(user.chatId);
      if (!list.length) {
        await ctx.reply('Список заказов пуст', Markup.inlineKeyboard([
          Markup.button.callback("Назад", "back")
        ]));
        return;
      }
      const buttons: any = list.map(orderNumber => Markup.button.callback(`${orderNumber.itemName} - ${orderNumber.itemCode}`, `order_${orderNumber.itemCode}`));
      buttons.push(Markup.button.callback("Назад", "back"));
      const keyboard = Markup.inlineKeyboard(buttons, { columns: 2 });
      await ctx.reply('Пожалуйста, Выберите заказ', keyboard)
    });

    orderListScene.on('text', async ctx => {
      if (ctx.message.text.trim() === '/start') {
        await ctx.scene.enter('registerContact');
        return;
      }

      if (ctx.message.text.trim() === '/stop') {
        await ctx.reply('Пока', Markup.keyboard([
          ["Запустить"],
        ]).oneTime().resize());
        return;
      }

      if (ctx.message.text.trim() === 'Назад') {
        await ctx.scene.enter('registerContact');
        return;
      }
    });


    orderListScene.action(/order_/, async (ctx: any) => {
      const orderId = ctx.callbackQuery.data.split('_')[1];
      ctx.session.orderId = orderId;
      console.log('orderId', orderId);
      await ctx.scene.enter('status');
    });

    orderListScene.action(/back/, async (ctx: any) => {
      await ctx.scene.enter('registerContact');
      return;
    });

    registerContactScene.on('contact', async ctx => {
      const userId = ctx.from.id;
      const phoneNumber = ctx.message.contact.phone_number;
      const client = await this.clientService.createUser(userId, phoneNumber);
      ctx.session.clientId = client.id
      ctx.session.registered = true;

      await ctx.reply("Благодарим Вас 🙌\n" +
        "Вы были зарегистрированы. Далее просим Вас выбрать услугу:");
      ctx.scene.enter('registerContact');
    });

    const provideOrderIdScene = new Scenes.BaseScene<any>('provideOrderId');
    provideOrderIdScene.enter(ctx => ctx.reply('Трековый код Вашего заказа:'));

    provideOrderIdScene.on('text', async ctx => {
      const orderId = ctx.message.text.trim();

      if (orderId === '/start') {
        await ctx.scene.enter('provideOrderId');
        return;
      }

      if (orderId === '/stop') {
        // await ctx.reply('Please share your contact by clicking the123123');
        return;
      }

      if (!this.isOrderId(orderId)) {
        await ctx.reply("Неверный трековый код заказа. Пожалуйста, укажите действительный трековый код Вашего заказа:");
        return;
      }

      const hasOrder = await this.productService.findByOrderCode(orderId);
      console.log('hasOrder', hasOrder)
      if (hasOrder) {
        await ctx.reply("Этот заказ уже имеется в базе");
        return;
      }

      ctx.session.orderId = orderId;
      ctx.session.chatId =  ctx.message.chat.id;
      await ctx.reply(`Ваш идентификатор заказа ${orderId} был сохранен.`);
      await ctx.reply("Хотели бы вы подтвердить ваш заказ?", Markup.inlineKeyboard([
        Markup.button.callback("Да", "confirm_yes"),
        Markup.button.callback("Нет", "confirm_no"),
      ]));
    });

    const afterRegisterScene = new Scenes.BaseScene<any>('afterRegister');

    afterRegisterScene.enter(async (ctx) => {
      const userId = ctx.from.id;
      const chatId = ctx.message.chat.id;
      const existingClient = await this.clientService.findByChatId(chatId);

      ctx.reply('Вы были зарегистрированы! Пожалуйста, укажите ваш номер заказа');

      if (existingClient) {
        ctx.session.clientId = existingClient.chatId;
        ctx.reply('Вы были зарегистрированы! Пожалуйста, укажите ваш номер заказа');
        ctx.scene.enter('provideOrderId');
      } else {
        ctx.reply('Пожалуйста поделитесь контаком', Markup.keyboard([[{
          text: "Зарегистрироваться",
          request_contact: true
        }]]).resize());
      }
    });


    provideOrderIdScene.action("confirm_yes", async (ctx: any) => {
      try {
        const orderId = ctx.session.orderId;
        const clientId = ctx.session.chatId;
        const cityId = ctx.session.cityId;
        const name = ctx.session.name;
        console.log('orderId', ctx.session.orderId)
        console.log('clientId', clientId);
        const new_order = await this.productService.create({itemCode: orderId, itemName: name, status: 0, client: clientId, city: cityId});
        this.webSocketGateway.broadcastNewOrder(new_order);
        await ctx.answerCbQuery("Ваш заказ принят! Когда посылка прибудет в Ваш город Вы получите уведомление в данном чате. Для дополнительных вопросов можете обращаться к нашим менеджерам.");
        await ctx.scene.enter('status');
      } catch (error) {
        console.error('Error saving order:', error);
        ctx.reply('Ошибка при офромление заказа');
      }
    });

    provideOrderIdScene.action("confirm_no", async (ctx: any) => {
      await ctx.answerCbQuery("Ваш заказ отменен");
      await ctx.scene.enter('provideOrderId');
    });

    provideOrderIdScene.leave((ctx) => {
      ctx.reply('Спасибо!');
    });

    const startProviderScene = new Scenes.BaseScene<any>('startScene');

    startProviderScene.enter(async ctx => {

      const orderId = ctx.session.orderId;

    });

    const statusProviderScene = new Scenes.BaseScene<any>('status');

    statusProviderScene.enter(async ctx => {
      const orderId = ctx.session.orderId;

      const orderStatus = await this.productService.findByOrderCode(orderId);
      let statusSymbol: string;

      if (orderStatus) {
        switch (orderStatus.status) {
          case 0:
            statusSymbol = "🟡 Ваш заказ в *ожидании*";
            break;
          case 1:
            statusSymbol = "🟢 Ваш заказ был *принят*! \n\n Товар будет доставлен в течений 2x-недель";
            break;
          case 2:
            statusSymbol = "🟢 Ваш заказ *прибыл*";
            break;
          case 3:
            statusSymbol = "🟢 Ваш заказ *выдан*";
            break;
          case 4:
            statusSymbol = "🔴 Ваш заказ был *отменен*";
            break;
          default:
            statusSymbol = "❓";
        }
        await ctx.replyWithMarkdown(`Ваш статус заказа: ${statusSymbol}`, Markup.keyboard([
          ["Назад"],
        ]).oneTime().resize());
        // ctx.scene.enter('orderListScene');
      } else {
        await ctx.reply('Failed to retrieve order status.');
      }
    });

    statusProviderScene.on('text', async ctx => {
      const message = ctx.message.text.trim();
      if (message === '/start') {
        await ctx.scene.enter('provideOrderId');
        return;
      }

      if (ctx.message.text.trim() === 'Назад') {
        await ctx.scene.enter('registerContact');
        return;
      }

      // const orderId = ctx.message.text;
      // // Assume isOrderId() function is defined elsewhere
      // if (!this.isOrderId(orderId)) {
      //   await ctx.reply("Invalid order ID. Please provide a valid order ID.");
      //   return;
      // }

      // ctx.session.orderId = orderId;
      // await ctx.reply(`Thank you! Your order ID ${orderId} has been saved.`);
      // await ctx.reply("Would you like to confirm your order?", Markup.inlineKeyboard([
      //   Markup.button.callback("Yes", "confirm_yes"),
      //   Markup.button.callback("No", "confirm_no"),
      // ]));
    });

    this.scene = new Scenes.Stage<any>([registerContactScene, provideOrderIdScene, statusProviderScene, orderListScene, citySelectScene, nameEnterScene]);

    this.bot.use(session());
    this.bot.use(this.scene.middleware());

    this.bot.command('start', async (ctx: any) => {
      console.log('ctx', ctx.message.text)
      if (ctx.message.text.trim() === '/start' || ctx.message.text.trim() === 'Запустить') {
        await ctx.scene.enter('registerContact');
        return;
      }
      // ctx.scenes.enter(registerContactScene);
    });

    this.bot.on('text', async (ctx: any) => {
      if (ctx.message.text.trim() === '/start' || ctx.message.text.trim() === 'Запустить') {
        await ctx.scene.enter('registerContact');
        return;
      }
      if (ctx.message.text.trim() === '/stop') {
        await ctx.scene.leave();
        await ctx.scene.enter('registerContact');
        return;
      }
    });

    // this.bot.command('stop', async (ctx: any) => {
    //   console.log('stop', ctx);
    //   await ctx.scene.leave();
    // });

    // this.bot.launch().then(() => {
    //   console.log('Telegram бот успешно запущен.');
    // }).catch((err) => {
    //   console.error('Ошибка запуска Telegram бота:', err)
    // });


  }
  private readonly bot: Telegraf<Context>;

  private scene: Scenes.Stage<MyContext>;

  // async onApplicationShutdown(signal?: string) {
  //   console.log(`Shutting down Telegram bot due to ${signal} signal...`);
  //   await this.bot.stop();
  //   console.log('Telegram bot stopped.');
  // }

  isOrderId(text: string): boolean {
    return /^[\w\d]{12,20}$/i.test(text);
  }

  // private setupScenes() {new Scenes.Stage<any>([registerContactScene, provideOrderIdScene])
  //   const stepHandler = new Scenes.Stage<any>(
  //     'stepHandler',
  //     async (ctx: Context) => {
  //       await ctx.reply('Step 1. What is your name?');
  //       ctx.scene.next();
  //     },
  //     async (ctx: Context) => {
  //       await ctx.reply(`Step 2. Hello, ${ctx.message.text}!`);
  //       ctx.scene.leave();
  //     },
  //   );

  async start() {
    await this.bot.launch();
  }

  async sendNotification(product: ProductItems): Promise<void> {
    let statusSymbol: string;
    switch (product.status) {
      case 0:
        statusSymbol = "🟡 Ваш заказ в *ожидании*";
        break;
      case 1:
        statusSymbol = "🟢 Ваш заказ был *принят*! \n\n Товар будет доставлен в течений 2x-недель";
        break;
      case 2:
        statusSymbol = "🟢 Ваш заказ *прибыл*";
        break;
      case 3:
        statusSymbol = "🟢 Ваш заказ *выдан*";
        break;
      case 4:
        statusSymbol = "🔴 Ваш заказ был *отменен*";
        break;
      default:
        statusSymbol = "❓";
    }
    const message = `
    Ваш номер заказа: *${product.itemCode}*-*${product.itemName}*\n\n 
    Статус заказа: ${statusSymbol}\n\n 
    Цена: *${product.costPerUnit}*\n\n 
    Вес: *${product.itemWeight}*
    `;
    await this.bot.telegram.sendMessage(product.client.chatId, message, { parse_mode: 'Markdown' });
  }

  // async stopBot() {
  //   await this.onApplicationShutdown();
  // }

  private async registerUser(ctx) {
    const chatId = ctx.message.chat.id; // Extract chat ID from the message
    const username = ctx.message.from.username; // Extract username from the message (if available)

    try {
      const existingUser = await this.clientService.findByChatId(chatId);
      if (existingUser) {
        await ctx.scene.enter('status');
        // ctx.reply('You are already registered!');
        // return;
      }
      const newUser = await this.clientService.createUser(chatId, username);
      ctx.reply('Вы были зарегистрированы!');
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      ctx.reply('Failed to register. Please try again later.');
      return false;
    }
  }

}
