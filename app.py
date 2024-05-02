from flask import Flask, request,render_template, jsonify
from flask_cors import CORS  # Importe o módulo Flask-CORS
import cv2
import numpy as np  
import pytesseract
import re

app = Flask(__name__, static_folder='static')
app = Flask(__name__)
CORS(app)  # Ative o CORS para o aplicativo Flask

@app.route('/extract-info', methods=['POST'])
def extract_information():
    return render_template('index.html')
    if request.method == 'POST':
        file = request.files['image']
        cliente = ""
        endereco = ""
        fone = ""

        # Carrega a imagem recebida do formulário
        imagem = cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_UNCHANGED)

        # Converte a imagem para escala de cinza
        imagem_cinza = cv2.cvtColor(imagem, cv2.COLOR_BGR2GRAY)

        # Aplica uma binarização na imagem para segmentar as regiões de texto
        _, imagem_binaria = cv2.threshold(imagem_cinza, 150, 255, cv2.THRESH_BINARY)

        # Encontra os contornos na imagem binarizada
        contornos, _ = cv2.findContours(imagem_binaria, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        caminho = r"static/Tesseract-OCR"

        pytesseract.pytesseract.tesseract_cmd = caminho + r"/tesseract.exe"

        for contorno in contornos:
            # Obtém as coordenadas do retângulo envolvente do contorno
            x, y, w, h = cv2.boundingRect(contorno)

            # Extrai a região de interesse (ROI) da imagem original
            roi = imagem[y:y + h, x:x + w]

            # Usa o pytesseract para extrair o texto da ROI
            texto = pytesseract.image_to_string(roi)

            if not cliente:
                match_cliente = re.search(r'Cliente\s*:\s*(.*)', texto)
                if match_cliente:
                    cliente = match_cliente.group(1).strip()

            if not endereco:
                match_endereco = re.search(r'Endereco\s*:\s*(.*)', texto)
                if match_endereco:
                    endereco = match_endereco.group(1).strip()

            if not fone:
                match_fone = re.search(r'Fone\s*:\s*(.*)', texto)
                if match_fone:
                    fone = match_fone.group(1).strip()

        # Retorna as informações extraídas em uma resposta JSON
        return jsonify({"cliente": cliente, "endereco": endereco, "fone": fone})
    else:
        return 'Use o método POST para enviar a imagem.'
if __name__ == '__main__':
    app.run(debug=True)
