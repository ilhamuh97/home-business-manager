import WAWebJS from 'whatsapp-web.js';
import MessageController from '../Controllers/MessageControllers';
import { capitalizeFirstLetter } from '../../utils/stringProcess';

class CommandHandler {
  messageController: MessageController;
  constructor(messageController: MessageController) {
    this.messageController = messageController;
  }

  handleCommand(message: WAWebJS.Message) {
    const [commandWithParam, ...args] = message.body
      .trim()
      .split('\n')
      .map((line) => capitalizeFirstLetter(line.trim()));

    const [command, ...params] = commandWithParam.trim().split(' ');

    switch (command) {
      case '/send-order':
        this.messageController.handleSendOrderCommand(command, args);
        break;
      case '/get-template':
        this.messageController.handleGetTemplateCommand(command);
        break;
      case '/update-order':
        this.messageController.handleUpdateCommand(command, args, params);
        break;
      case '/get-order':
        this.messageController.handleGetOrderCommand(command, params);
        break;
      case '/get-commands':
        this.messageController.handleGetCommandsCommand(command);
        break;
      default:
        console.log('Unknown command:', command);
        break;
    }
  }
}

export default CommandHandler;
