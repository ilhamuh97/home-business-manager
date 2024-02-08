import MessageController from '../Controllers/MessageControllers';
import {
  capitalizeFirstLetter,
  getReadableRawOrder,
} from '../../utils/stringProcess';

class CommandHandler {
  messageController: MessageController;
  constructor(messageController: MessageController) {
    this.messageController = messageController;
  }

  async handleCommand(message: string, isTemplate: boolean = false) {
    const lines = message.trim().split('\n');
    const [commandWithParam, ...args] = lines.map((line) =>
      capitalizeFirstLetter(line.trim()),
    );
    const [command, ...params] = commandWithParam.trim().split(' ');

    switch (command) {
      case '/send-order':
        this.handleSendOrderCommand(args, isTemplate);
        break;
      case '/get-template':
        this.handleGetTemplateCommand(params, isTemplate);
        break;
      case '/update-order':
        this.handleUpdateCommand(args, params, isTemplate);
        break;
      case '/get-order':
        this.handleGetOrderCommand(params, isTemplate);
        break;
      case '/get-commands':
        this.handleGetCommandsCommand(isTemplate);
        break;
      default:
        console.log('Unknown command:', command);
        break;
    }
  }

  private async handleSendOrderCommand(args: string[], isTemplate: boolean) {
    if (!isTemplate) {
      this.messageController.handleSendOrderCommand(args);
    } else {
      this.messageController.sendTemplate(
        await this.generateSendOrderTemplate(),
      );
    }
  }

  private async handleGetTemplateCommand(
    params: string[],
    isTemplate: boolean,
  ) {
    if (!isTemplate) {
      this.messageController.handleGetTemplateCommand(params);
    } else {
      this.messageController.sendTemplate(this.generateGetTemplate());
    }
  }

  private async handleUpdateCommand(
    args: string[],
    params: string[],
    isTemplate: boolean,
  ) {
    if (!isTemplate) {
      this.messageController.handleUpdateCommand(args, params);
    } else {
      this.messageController.sendTemplate(
        await this.generateUpdateOrderTemplate(),
      );
    }
  }

  private async handleGetOrderCommand(params: string[], isTemplate: boolean) {
    if (!isTemplate) {
      this.messageController.handleGetOrderCommand(params);
    } else {
      this.messageController.sendTemplate(this.generateGetOrderTemplate());
    }
  }

  private async handleGetCommandsCommand(isTemplate: boolean) {
    if (!isTemplate) {
      this.messageController.handleGetCommandsCommand();
    } else {
      this.messageController.sendTemplate(this.generateGetCommands());
    }
  }

  private async generateSendOrderTemplate() {
    try {
      const readableData = await getReadableRawOrder();
      const template = `/send-order\n${readableData}`;
      return template;
    } catch (error: any) {
      return error.message;
    }
  }

  private async generateUpdateOrderTemplate() {
    try {
      const readableData = await getReadableRawOrder();
      const template = `/update-order <Invoice Number>\n${readableData}`;
      return template;
    } catch (error: any) {
      return error.message;
    }
  }

  private generateGetOrderTemplate(): string {
    return `/get-order <Invoice Number>`;
  }

  private generateGetTemplate(): string {
    return '/get-template';
  }

  private generateGetCommands(): string {
    return '/get-commands';
  }
}

export default CommandHandler;
