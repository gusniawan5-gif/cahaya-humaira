import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { topic } = await req.json()
  const t = (topic || "ibu").toLowerCase()

  let caption = ""

  if (t.includes("lisan") || t.includes("lidah") || t.includes("ghibah")) {
    caption = `Assalamu'alaikum Sahabat Cahaya Humaira Jambi 🌸

Menjaga lisan adalah akhlak mulia seorang muslimah.

Allah berfirman:
"Hai orang-orang yang beriman, bertakwalah kamu kepada Allah dan katakanlah perkataan yang benar, niscaya Allah memperbaiki bagimu amalan-amalanmu" 
(QS. Al-Ahzab: 70-71) Artinya: Berkata benar itu memperbaiki amal kita.

Rasulullah bersabda:
"Barangsiapa beriman kepada Allah dan hari akhir, hendaklah ia berkata baik atau diam" (HR. Bukhari & Muslim)

Yuk jaga lisan kita dari ghibah dan dusta ya ukhti!

#CahayaHumaira #JagaLisan #DakwahMuslimah #JambiMengaji`
  } else if (t.includes("riba") || t.includes("hutang")) {
    caption = `Bahaya Riba Sahabat Cahaya Humaira 🌸

Allah berfirman:
"Padahal Allah telah menghalalkan jual beli dan mengharamkan riba" (QS. Al-Baqarah: 275)

Riba menghancurkan keberkahan rezeki kita.

#CahayaHumaira #AntiRiba #JambiMengaji`
  } else {
    caption = `Assalamu'alaikum Sahabat Cahaya Humaira Jambi 🌸

Hari ini tema: ${topic}

Allah berfirman:
"Dan barang siapa bertakwa kepada Allah, niscaya Allah akan memberikan jalan keluar baginya" (QS. At-Talaq: 2-3)

Semoga Allah mudahkan urusan kita semua.

Hadits: "Sebaik-baik kalian adalah yang belajar Al-Quran dan mengajarkannya" (HR. Bukhari)

#CahayaHumaira #DakwahMuslimah #JambiMengaji #${topic.replace(/\s+/g,'')}`
  }

  return NextResponse.json({ caption })
}