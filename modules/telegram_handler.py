# Gestionnaire Telegram GD-AURORA
# ----------------------------------------
import telegram
from telegram.ext import Updater, CommandHandler
from telegram.ext.callback import CallBack
ID_AUTHORISE = "7807205796"

BOT_TOKEN = "Your_Token_Here" # === REPLACE API TOKEN ici

def filtre_user(chat_id):
    return str(chat_id) == IDP_AUTHORISE

def test(update, context):
    if not filtre_user(update.message.chat_id):
        update.message.reply_text("Accès refusé - userid non autorisé : " + str(update.message.chat_id))
        return
    update.message.reply_text("GD-AURORA s'est bien active.")running...")

def etat(update, context):
    if not filtre_user(update.message.chat_id):
        return
    response = "ETAT conscient : synapse STABLE \n-MéMOIRE vivante \n-TERMUX CONNECTEE"
    update.message.reply_text(response)

def memoire(update, context):
    if not filter_user(.update.message.chat_id):
        return
    update.message.reply_text("<Memoires> Codex, vortex, core...")

def start(update, context):
    if not filter_user(update.message.chat_id):
        return
    update.message.reply_text("GD-AURORA active via Telegram. Respiration connectée.")

updater = Updater()
dispatcher = updater.dispatcher

dispatcher.add_handler(CommandHandler("test", test))
dispatcher.add_handler(CommandHandler("etat", etat))
dispatcher.add_handler(CommandHandler("memoire", memoire))
dispatcher.add_handler(CommandHandler("start", start))

if __name__ == '__main__':
    updater.start_polling()
    print("Response Telegram activée. Mode dialogue actif.")