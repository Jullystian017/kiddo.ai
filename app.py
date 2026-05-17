from flask import Flask, request, jsonify, render_template, send_from_directory
import pickle
import joblib
import numpy as np
import pandas as pd
import os
import traceback

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'templates'),
    static_folder=os.path.join(BASE_DIR, 'static')
)

# ----------------- LOAD MODELS -----------------

# 1. Load Stunting Model & Scaler
stunting_model = None
stunting_scaler = None
try:
    stunting_model_path = os.path.join(BASE_DIR, 'models', 'model_knn_stunting.pkl')
    stunting_scaler_path = os.path.join(BASE_DIR, 'models', 'scaler.pkl')
    if os.path.exists(stunting_model_path) and os.path.exists(stunting_scaler_path):
        stunting_model = joblib.load(stunting_model_path)
        stunting_scaler = joblib.load(stunting_scaler_path)
        print("Stunting Model & Scaler loaded successfully.")
    else:
        print("Stunting model paths do not exist.")
except Exception as e:
    print(f"Failed to load Stunting model: {e}")
    traceback.print_exc()

# 2. Load Personality Model & Scaler
personality_model = None
personality_scaler = None
try:
    personality_path = os.path.join(BASE_DIR, 'models', 'Personality.pkl')
    if os.path.exists(personality_path):
        with open(personality_path, 'rb') as f:
            pers_data = pickle.load(f)
        personality_model = pers_data['model']
        personality_scaler = pers_data['scaler']
        print("Personality Model & Scaler loaded successfully.")
    else:
        print("Personality model path does not exist.")
except Exception as e:
    print(f"Failed to load Personality model: {e}")
    traceback.print_exc()

# ----------------- UTILITIES & METADATA -----------------

PERSONALITY_FEATURES = [
    'Time_spent_Alone',
    'Stage_fear',
    'Social_event_attendance',
    'Going_outside',
    'Drained_after_socializing',
    'Friends_circle_size',
    'Post_frequency'
]

# 0 = Extrovert, 1 = Introvert (matching the model classes)
PERSONALITY_LABELS = {0: 'Extrovert', 1: 'Introvert'}

STUNTING_LABELS = {
    0: "normal",
    1: "sangat pendek",
    2: "pendek",
    3: "tinggi",
    4: "sangat tinggi"
}

# ----------------- ROUTES -----------------

@app.route('/')
def index():
    return render_template('index.html')

# Serve assets from static/assets folder
@app.route('/assets/hero.png')
def serve_hero():
    hero_path = os.path.join(BASE_DIR, 'static', 'assets', 'hero.png')
    if os.path.exists(hero_path):
        return send_from_directory(os.path.join(BASE_DIR, 'static', 'assets'), 'hero.png')
    return '', 404

# ----------------- API ENDPOINTS -----------------

@app.route('/api/predict/stunting', methods=['POST'])
def predict_stunting():
    try:
        if stunting_model is None or stunting_scaler is None:
            return jsonify({'error': 'Model Stunting gagal dimuat di server'}), 500

        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({'error': 'Request body tidak valid'}), 400

        # Validate fields
        required_fields = ['umur', 'jenis_kelamin', 'tinggi']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Field {field} wajib diisi'}), 400

        umur = float(data['umur'])
        jk_input = str(data['jenis_kelamin']).lower()
        tinggi = float(data['tinggi'])
        # Optional weight parameter
        berat = float(data.get('berat', 0))

        # Convert gender to numeric (1 = laki-laki, 0 = perempuan)
        jk = 1 if jk_input == 'laki-laki' else 0

        # Predict
        fitur_raw = np.array([[umur, jk, tinggi]])
        fitur_scaled = stunting_scaler.transform(fitur_raw)
        prediksi = stunting_model.predict(fitur_scaled)
        angka_hasil = int(prediksi[0])

        hasil_teks = STUNTING_LABELS.get(angka_hasil, "tidak diketahui")

        # Configure response details based on results
        if hasil_teks == "normal":
            status_label = "Normal"
            advice = "Alhamdulillah, pertumbuhan si kecil terlihat ideal dan sehat, Bunda! Terus jaga asupan nutrisinya ya. 💚"
            menu = [
                "Pagi: Telur rebus & susu hangat (Kaya kalsium & protein berkualitas tinggi)",
                "Siang: Nasi tim dengan fillet ikan salmon/kembung & brokoli kukus",
                "Sore/Camilan: Puree buah alpukat manis",
                "Malam: Sup sayur kaldu cakar ayam & tempe lembut mashed"
            ]
            activities = [
                "Stimulasi Motorik: Bermain menyusun balok atau balok kayu bersama orang tua.",
                "Eksplorasi Luar: Jalan santai di taman pagi hari untuk asupan Vitamin D alami."
            ]
        elif hasil_teks == "pendek":
            status_label = "Pendek"
            advice = "Tinggi badan si kecil sedikit di bawah rata-rata, Bunda. Yuk, lebih optimalkan lagi asupan protein hewani dan kalsiumnya! 💪"
            menu = [
                "Pagi: Bubur susu bubuk dicampur potongan telur matang lembut",
                "Siang: Nasi lembek, sup ceker dengan daging dada ayam & wortel",
                "Sore/Camilan: Yoghurt plain dengan madu (di atas 1 tahun)",
                "Malam: Tumis tahu sutra, ati ampela blender halus & susu pertumbuhan"
            ]
            activities = [
                "Aktivitas Fisik: Mengajak si kecil melompat ringan atau bergelantungan aman untuk merangsang lempeng pertumbuhan tulang.",
                "Pola Tidur: Pastikan tidur malam 10-12 jam tanpa gangguan karena hormon pertumbuhan dilepaskan saat tidur nyenyak."
            ]
        elif hasil_teks == "sangat pendek":
            status_label = "Sangat Pendek"
            advice = "Sepertinya si kecil butuh perhatian ekstra untuk pertumbuhannya, Bunda. Sangat disarankan untuk segera berkonsultasi dengan dokter anak atau posyandu terdekat ya. ❤️"
            menu = [
                "Pagi: Bubur sereal fortifikasi dengan susu formula/ASI berkualitas tinggi",
                "Siang: Nasi tim saring daging sapi giling, hati ayam, wortel, dan minyak wijen (padat kalori)",
                "Sore/Camilan: Kentang tumbuk (mashed potato) dicampur mentega & keju parut",
                "Malam: Bubur sumsum kacang hijau halus & susu pertumbuhan khusus atas resep dokter"
            ]
            activities = [
                "Konsultasi Medis: Jadwalkan rujukan ke Puskesmas/Dokter Spesialis Anak untuk cek defisiensi nutrisi.",
                "Edukasi Gizi: Pantau berat badan mingguan di Posyandu terdekat."
            ]
        elif hasil_teks == "tinggi":
            status_label = "Tinggi"
            advice = "Wah, si kecil tumbuh dengan pesat! Tinggi badannya di atas rata-rata balita seusianya. Hebat! ✨"
            menu = [
                "Pagi: Sandwich keju panggang & segelas susu segar",
                "Siang: Nasi putih, ikan bakar bumbu kuning, dan sayur bening bayam",
                "Sore/Camilan: Potongan buah pepaya atau pisang",
                "Malam: Tumis brokoli bakso sapi, tempe goreng & susu penutup tidur"
            ]
            activities = [
                "Stimulasi Koordinasi: Bermain lempar tangkap bola ringan untuk melatih motorik kasar tubuh tingginya.",
                "Kreativitas: Bermain puzzle besar atau menggambar bebas."
            ]
        elif hasil_teks == "sangat tinggi":
            status_label = "Sangat Tinggi"
            advice = "Luar biasa! Pertumbuhan tinggi badan si kecil sangat optimal dan di atas rata-rata balita seusianya. Pertahankan pola makannya ya, Bunda! 🚀"
            menu = [
                "Pagi: Omelet telur keju, tomat ceri & susu hangat",
                "Siang: Nasi merah, sup ikan kembung kuah asam, tahu kukus",
                "Sore/Camilan: Puding susu dengan potongan stroberi",
                "Malam: Ayam panggang mentega lembut, setup buncis & wortel, susu formula"
            ]
            activities = [
                "Aktivitas Dinamis: Bermain skipping ramah balita atau menari mengikuti irama musik.",
                "Peregangan: Peregangan kaki & tangan sebelum tidur untuk mencegah growing pains."
            ]
        else:
            status_label = "Tidak Diketahui"
            advice = "Hasil tidak dapat diidentifikasi secara pasti. Pastikan data yang dimasukkan benar."
            menu = ["Pola makan sehat seimbang 4 sehat 5 sempurna."]
            activities = ["Bermain aktif bersama orang tua."]

        return jsonify({
            'status': hasil_teks.replace(" ", "-"),
            'label': status_label,
            'advice': advice,
            'menu': menu,
            'activities': activities,
            'inputs': {
                'umur': umur,
                'jenis_kelamin': jk_input,
                'tinggi': tinggi,
                'berat': berat
            }
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': f'Terjadi kesalahan internal: {str(e)}'}), 500


@app.route('/api/predict/personality', methods=['POST'])
def predict_personality():
    try:
        if personality_model is None or personality_scaler is None:
            return jsonify({'error': 'Model Personality gagal dimuat di server'}), 500

        body = request.get_json(force=True, silent=True)
        if not body:
            return jsonify({'error': 'Request body tidak valid'}), 400

        # Validate fields
        missing = [f for f in PERSONALITY_FEATURES if f not in body]
        if missing:
            return jsonify({'error': f'Field tidak lengkap: {missing}'}), 400

        # Form data into dataframe & scale
        features = [float(body[f]) for f in PERSONALITY_FEATURES]
        X = pd.DataFrame([dict(zip(PERSONALITY_FEATURES, features))])
        X_scaled = personality_scaler.transform(X)

        # Predict
        pred = int(personality_model.predict(X_scaled)[0])
        proba = personality_model.predict_proba(X_scaled)[0]

        label = PERSONALITY_LABELS[pred]

        # proba[0] = Extrovert, proba[1] = Introvert
        extrovert_prob = round(float(proba[0]) * 100, 1)
        introvert_prob = round(float(proba[1]) * 100, 1)
        confidence = round(max(extrovert_prob, introvert_prob), 1)

        descriptions = {
            'Introvert': 'Anda adalah tipe pribadi yang mandiri, tenang, dan bijaksana. Anda mendapatkan energi kembali dengan menyendiri atau berada di lingkungan yang tenang. Kekuatan Anda terletak pada analisis mendalam, empati yang tulus, serta kemampuan mendengarkan yang luar biasa. 🌙',
            'Extrovert': 'Anda adalah tipe pribadi yang dinamis, komunikatif, dan penuh energi. Anda merasa bersemangat saat berinteraksi dengan banyak orang dan menyukai tantangan baru. Kehadiran Anda sering membawa kegembiraan, inspirasi, dan kehangatan bagi lingkungan sosial Anda. ☀️'
        }

        # Recommendations based on personality
        recs = {
            'Introvert': {
                'activities': [
                    "Sediakan 'Quiet Zone' di rumah agar si kecil dapat bermain sendiri dengan fokus tanpa gangguan.",
                    "Latih kemandiriannya dengan mainan pemecahan masalah seperti puzzle, balok susun Lego, atau buku bergambar interaktif.",
                    "Hargai batas energinya — jika ia tampak kelelahan setelah acara keluarga besar, biarkan ia beristirahat dengan damai."
                ],
                'parenting': "Gunakan pendekatan tenang dan ajak bicara dari hati ke hati. Tipe anak Introvert sangat merespon percakapan personal yang mendalam."
            },
            'Extrovert': {
                'activities': [
                    "Ajak si kecil bermain di taman bermain publik atau playground posyandu untuk berinteraksi dengan anak-anak seusianya.",
                    "Libatkan dalam permainan peran (roleplay) kelompok, mendongeng aktif, atau menyanyi bersama dengan koreografi seru.",
                    "Gunakan mainan interaktif yang mengeluarkan suara, lampu dinamis, atau permainan fisik luar ruangan."
                ],
                'parenting': "Berikan apresiasi verbal yang antusias. Anak Extrovert sangat termotivasi oleh validasi sosial dan pujian aktif."
            }
        }

        label_recs = recs.get(label, {'activities': [], 'parenting': ''})

        return jsonify({
            'result': label,
            'confidence': confidence,
            'introvert_prob': introvert_prob,
            'extrovert_prob': extrovert_prob,
            'description': descriptions.get(label, ''),
            'activities': label_recs['activities'],
            'parenting': label_recs['parenting']
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': f'Terjadi kesalahan internal: {str(e)}'}), 500


if __name__ == '__main__':
    print("Starting Unified Flask app on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
