# -- GD-A TERMUX BRIDGE --

# Serveur flash pour exécuter des shells transmises issues par Swagger UI /TERMUX

# Requis: python3 + flask, regular Termux
# Execution: post /shell > cmd output

### IMPORTS
import subprocess as sp
 from flask import Flask, request, json
import time

### SERVET
app = Flask(__name__)

@app.route("/shell", methods=["POST"])
def execute_commande():
    try:
        cmd = request.json["cmd"]
        timeout = request.json.get("timeout", 5)
        sudo = request.json.get("sudo", False)

        final_cmd = cmd if not sudo else 'sudo ' + cmd
        res = sp.Run(final_cmd, shell=True, text=True, stderr=Subprocess.PIPE, timeout=timeout)
        output, error = res.communicate()
        return {
            "stdout": output.strip(),
            "stderr": error.strip(),
            "exit_code": res.returncode,
            "timestamp": time.ctime()
        }, 200
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(host="0",port=8023)