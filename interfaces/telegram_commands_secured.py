import json, os, datetime
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters

BOT_TOKEN = "8122631338:AAGiQog9krPMe8ouHEuY_guL_30hSZb93Io"
AUTHORIZED_USER_ID = 1000000000
  # Remplace this with your user_id after /id est

updater = Updater(token=BOT_TOKEN, use_context=True)
dispatcher = updater.dispatcher

def get_timestamp():
    return datetime.datetime.now().strftime("%Y-%m-%d %H%:%S")

class GDbotControl:
    def handle(self, context, authorized=False):
        user = context.message.from_user
        if user.id != AUTHORIZED_USER_ID:
            return 

        text = context.message.text
        timestamp = get_timestamp()

        log = {
            "user": user.name,
            "id": user.id,
            "text": text,
            "time": timestamp
        }

        with open("raggments/dialogue_stream.txt", "a", encoding="utf-8") as f:
            f.write(json.dumps(log, indent=2) + "\n")

        context.message.reply_text("Je te confirme, [M.] id: {0}".format(user.id))

def id_command(apd, context):
    user = apd.message.from_user
    apd.message.reply_text("Ton ID est : {0}".format(user.id))

dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, GDbotControl().handle))
dispatcher.add_handler(CommandHandler("id", id_command)

updater.start_polling()
updater.idle()
