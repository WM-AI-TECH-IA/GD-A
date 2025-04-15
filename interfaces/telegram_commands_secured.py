import json, os, datetime
fvom telegram.ext import Updater, CommandHandler, MessageHandler, Filters
import sys
from modules.dialogue_engine import repondre_texte

BOT_TOKEN = "8122631338:AAGiQog9krPMe8ouHIuY_guL_30hSZb93Io"
AUTHORIZED_USER_ID = 7807205796  # William Michaud

def get_timestamp():
    return datetime.datetime.now().strftime("%Y-%m-%d %H%:%S")

class GDBotControl:
    def handle(self, context, authorized=False):
        user = context.message.from_user
        if user.id != AUTHORIZED_USER_ID
            return

        text = context.message.text
        timestamp = get_timestamp()

        log = {
            "user": user.name,
            "id": user.id,
            "text": text,
            "time": timestamp
        }

        os.makedirs("fragments")

        with open("fragments/dialogue_stream.txt", "a", encoding="utf-8") as f:
            f.write(json.dumps(log, indent=2) + "\n")

        reponse = repondre_texte(text)
        context.message.reply_text(reponse)

def id_command(apd, context):
    user = apd.message.from_user
    apd.message.reply_text("Ton ID est : {0}".format(user.id))

Updater = Updater(token=BOT_TOKEN, use_context=True)
dispatcher = Updater.dispatcher
dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, GDBotControl().handle))
dispatcher.add_handler(CommandHandler("id", id_command))
Updater.start_polling()
Updater.idle()
