import {ReactDOM, useEffect, useState } from "react";
import axios from "axios"

function Navbar({setSurah, semuaSurah, surah, scrollTos}) {
    return (
    <nav>
      <div className="navHeader">
        Alquran Indonesia
      </div>
      <div className="navInput">
        <select name="surahh" id="surah" value={surah} onChange={(ev) => {
          setSurah(ev.currentTarget.value)
        }}>
          {
            semuaSurah?.map(el => (
              <option key={el.nomor} value={el.nomor}>{el.nama}</option>
            ))
          }
        </select>
        <input type="number" onInput={(ev) => {
          
          scrollTos(ev.currentTarget.value)
        }} placeholder={"ayat (maks : "+semuaSurah[surah-1]?.ayat+")"} min={0} max={semuaSurah[surah-1]?.ayat} />
      </div>
    </nav>
  )
}

function Loading({isLoading}) {
  return (
    <div style={{display : isLoading ? "grid" : "none"}} className="modal">
      <div className="box">
        Sedang Loading
      </div>
    </div>
  )
} 

function Card({data}) {
  return (
    <div className="card" id={"nomor-"+data.nomor} data-nomor={data.nomor} >
      <div className="ayat">
        {data.ar}
      </div>
      <div className="kataArab" dangerouslySetInnerHTML={{__html : data.tr}}>

      </div>
      <div className="arti">
        {data.id}
      </div>
    </div>
  )
}



function App() {
  const [datas, setData] = useState([])
  const [surah, setSurah] = useState(1)
  const [semuaSurah, setSemuaSurah] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [audio, setAudio] = useState(null)
  function getAllSurah() {
        axios.get("https://al-quran-8d642.firebaseio.com/data.json?print=pretty").then(dat => {
        console.log(dat.data)
        setSemuaSurah(dat.data)
      })
  }

  function scrolling(ayat) {
    const dom = document.getElementById("nomor-"+ayat)
    console.log(dom)
    window.scrollTo({ behavior: 'smooth', top: dom.offsetTop-200 })
  }

  function setSurahs(surah) {
    setSurah(surah)
    setData([])
    setLoading(true)
  }

  function getSurah() {
    axios.get(`https://al-quran-8d642.firebaseio.com/surat/${surah}.json?print=pretty`, {}).then(dat => {
      console.log(dat.data)
      setLoading(false)
      setData(dat.data)
      console.log(semuaSurah[surah-1]?.audio)
      setAudio(semuaSurah[surah-1]?.audio)
    })

  }

  useEffect(() => {
    getAllSurah()
  }, [])

  useEffect(() => {
    getSurah()
  }, [surah, semuaSurah])
  
  return (
    <>
    <audio src={audio} controls>
    </audio>
    <Loading isLoading={isLoading} />
    <Navbar setSurah={setSurahs} surah={surah} semuaSurah={semuaSurah} scrollTos={scrolling} />
    <div className="surahHeader">
      <h1>{semuaSurah[surah-1]?.nama}({semuaSurah[surah-1]?.arti})</h1>
        
    </div>
    <div className="cards">

    {
      datas.map(el => (
        <Card key={el.nomor} data={el} />
      ))
    }
    </div>
    </>
  );
}

export default App;

