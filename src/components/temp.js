import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import styles from './Card.css';
import { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import ReactLoading from "react-loading";

function Card(props) {

    const BG = "#DFE0E2"; //#01c1d4
    const RED = "#DE1A1A";
    const GREEN = "#09E85E";
    const YELLOW = "#F0A202";

    const headers = {
        'Content-Type': 'text/plain'
    };

    let [loading, setLoading] = useState(false);
    let [lastDataStatusFile, setLastDataStatusFile] = useState(null)

    const [boolMedia, setBoolMedia] = useState(true)
    const [dataMedia, setDataMedia] = useState(null)
    const [nCreated, setNCreated] = useState(0)
    const [nDeleted, setNDeleted] = useState(0)
    const [mediaCreated, setMediaCreated] = useState(0)
    const [mediaDeleted, setMediaDeleted] = useState(0)

    const [boolTamanho, setBoolTamanho] = useState(true)

    function progressBar (percent, width) {

        const BGBAR = "#565554"; //#DFE0E2
        percent = percent/100;
        var widthOut = width;
        var widthIn = width * percent;
        let color = YELLOW; //amarelo
        if (percent >= 0.95){
            color = "#"; //vermelho
        } else if (percent <= 0.5) {
            color = GREEN //verde
        }
        return(
        <div style={{width: widthOut + 50 + "px", height:"25px", display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", margin:"5px"}}>
            <div style={{width: widthOut + "px", height:"20px", backgroundColor:BGBAR, borderRadius:"100px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                <div style={{left:'10px', width:width-5, height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", justifyItems:"center"}}>
                    <div style={{width: widthIn + "px", height:"15px", backgroundColor:color, display:"flex",borderRadius:"100px", alignSelf:"flex-start", justifySelf:"center"}}>

                    </div>
                </div>
            </div>
            <text>{Math.round(percent*100) + "%"}</text>
        </div>
    )}

    function textHealthOperation(running, number) {
        return(
            <div>
                {running === number ? (
                <div style={{padding:"2px", paddingLeft:"4px", paddingRight:"4px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                    <div style={{background:GREEN, borderRadius:"100px", width:"10px", height:"10px", marginRight:"5px", borderColor:"black"}}></div>
                    <text>Em operação: {running}/{number}</text>
                </div>
                ):(
                <div style={{padding:"2px", paddingLeft:"4px", paddingRight:"4px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                    <div style={{background:RED, borderRadius:"100px", width:"10px", height:"10px", marginRight:"5px"}}></div>
                    <text>Em operação: {running}/{number}</text>
                </div>)}
            </div>)}

    function textHealthSeconds(seconds) {

        return(
        <div>
            {seconds < 300 ? (
            <div style={{padding:"2px", paddingLeft:"4px", paddingRight:"4px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                <div style={{background:GREEN, borderRadius:"100px", width:"10px", height:"10px", marginRight:"5px", borderColor:"black"}}></div>
                <text>Última atualização: {seconds} seg.</text>
            </div>
            ):(
            <div style={{padding:"2px", paddingLeft:"4px", paddingRight:"4px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                <div style={{background:RED, borderRadius:"100px", width:"10px", height:"10px", marginRight:"5px"}}></div>
                <text>Última atualização: {seconds} seg.</text>
            </div>)}
        </div>)}

    function textHealthReset(hours) {

        return(
        <div>
            {hours < 24 ? (
            <div style={{padding:"2px", paddingLeft:"4px", paddingRight:"4px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                <div style={{background:GREEN, borderRadius:"100px", width:"10px", height:"10px", marginRight:"5px", borderColor:"black"}}></div>
                <text>Último reset: {hours}h</text>
            </div>
            ):(
            <div style={{padding:"2px", paddingLeft:"4px", paddingRight:"4px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                <div style={{background:RED, borderRadius:"100px", width:"10px", height:"10px", marginRight:"5px"}}></div>
                <text>Último reset: {hours}h</text>
            </div>)}
        </div>)}
    
    function textHealthQueue(fila) {

        return(
        <div>
            {fila < 10 ? (
            <div style={{padding:"2px", paddingLeft:"4px", paddingRight:"4px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                <div style={{background:GREEN, borderRadius:"100px", width:"10px", height:"10px", marginRight:"5px", borderColor:"black"}}></div>
                <text>Fila de processamento: {fila}</text>
            </div>
            ):(
            <div style={{padding:"2px", paddingLeft:"4px", paddingRight:"4px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                <div style={{background:RED, borderRadius:"100px", width:"10px", height:"10px", marginRight:"5px"}}></div>
                <text>Fila de processamento: {fila}</text>
            </div>)}
        </div>)}

    function geraMediaStatusFiles(dados) {
        let dataRecente = new Date("2000-01-01");
        let nRecente;
        for (let n in dados){
            let dataRaw = dados[n]["data"].slice(0,10)
            let ano = dataRaw.split("-")[0]
            let mes = dataRaw.split("-")[1]
            let dia = dataRaw.split("-")[2]
            let dataMid = new Date(ano, mes, dia)
            if (dataMid > dataRecente) {
                dataRecente = dataMid
                nRecente = n
            }
        }

        setDataMedia(("0" + dataRecente.getDate()).slice(-2) + "/" + ("0" + (dataRecente.getMonth())).slice(-2) + "/" + dataRecente.getFullYear())
        setNCreated(dados[nRecente]["created"]);
        setNDeleted(dados[nRecente]["deleted"]);

        let somaCreated = 0;
        let somaDeleted = 0;
        let quantidade = dados.length - 1

        for (let n in dados) {
            let dataRaw = dados[n]["data"].slice(0,10)
            let ano = dataRaw.split("-")[0]
            let mes = dataRaw.split("-")[1]
            let dia = dataRaw.split("-")[2]

            if (ano != dataRecente.getFullYear() || mes != dataRecente.getMonth() || dia != dataRecente.getDate()){

                somaCreated += dados[n]["created"]
                somaDeleted += dados[n]["deleted"]

            }
        }

        setMediaCreated(Math.round(somaCreated/quantidade));
        setMediaDeleted(Math.round(somaDeleted/quantidade));

        setBoolMedia(false);
       }

    function pintaMedia(unico, media){
        let col = "#rgba(0, 0, 0, 0)"
        let colT = "black"
        if (unico > media*1.2 || unico < media*0.8){
            col = "rgba(222, 26, 26, 0.8)"
            colT = "white"
        }

        return(
            <div style={{backgroundColor:col, padding:"1px", paddingLeft:"4px", paddingRight:"4px"}}>
                <text style={{color:colT}}>{unico}</text>
            </div>)
        }

    function dataStatusTamanho(dados){
        let dataRecente = new Date("2000-01-01");
        let nRecente;
        for (let n in dados){
            let dataRaw = dados[n]["data"].slice(0,10)
            let ano = dataRaw.split("-")[0]
            let mes = dataRaw.split("-")[1]
            let dia = dataRaw.split("-")[2]
            let dataMid = new Date(ano, mes, dia)
            if (dataMid > dataRecente) {
                dataRecente = dataMid
                nRecente = n
            }
        }

        console.log(dataRecente)

        let dicMediaTamanhos = {};
        let dicQuantTamanhos = {};

        for (let n in dados) {
            let dataRaw = dados[n]["data"].slice(0,10)
            let ano = dataRaw.split("-")[0]
            let mes = dataRaw.split("-")[1]
            let dia = dataRaw.split("-")[2]
            let pov = dados[n]["pov"]

            if (ano != dataRecente.getFullYear() || mes != dataRecente.getMonth() || dia != dataRecente.getDate()){

                if (dicMediaTamanhos.hasOwnProperty(pov)) {
                    dicMediaTamanhos[pov] += dados[n]["mb"];
                    dicQuantTamanhos[pov] += 1;
                } else {
                    dicMediaTamanhos[pov] = dados[n]["mb"];
                    dicQuantTamanhos[pov] = 1;
                }
            }
        }

        console.log(dicMediaTamanhos)
        console.log(dicQuantTamanhos)

        setBoolTamanho(false)
    }

    function estadoSight (estado) {

        let texto = "Analisando";
        let color = GREEN;

        if (estado === "desligada"){
            texto = "Desligado"
            color = RED
        }
        else if (estado === "ligada"){
            texto = "Ligado"
            color = YELLOW
        }

        return (
            <div style={{padding:"2px", paddingLeft:"4px", paddingRight:"4px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                <div style={{background:color, borderRadius:"100px", width:"10px", height:"10px", marginRight:"5px", borderColor:"black"}}></div>
                <text>{texto}</text>
            </div>)
        }

  return (
    <div>
    {loading ? (
        <div style={{width:"500px", minHeight:"800px", backgroundColor:"gray", margin:"10px", fontFamily:"Arial", padding:"10px", boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", opacity:"50%", display:"flex", alignItems:"center", justifyContent:"center"}}>
            <ReactLoading type={"bars"} color={"black"} />
        </div>
    ):(
    <div style={{width:"500px", minHeight:"800px", backgroundColor:BG, margin:"10px", fontFamily:"Arial", padding:"10px", boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>        
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"flex-end"}}>
            <h2 style={{margin:"5px"}}>{props.horusHealthStatus["locationName"]}</h2>
            <h3 style={{margin:"5px"}}>{"IP: " + props.horusHealthStatus["ip"]}</h3>
        </div>
        <h4 style={{marginBottom:"0px"}}>Status computador</h4>
        <hr style={{height:"2px", width:"100%", borderColor:"black", backgroundColor:"black", opacity:"50%", marginTop:"2px"}}></hr>
        <div style={{display:"flex", flexDirection:"column"}}>
            {props.statusPc && (
            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", marginTop:"10px"}}>
                <div style={{display:"flex", flexDirection:"column"}}>
                    <text style={{fontWeight:"bolder"}}>CPU:</text>
                    {progressBar(props.statusPc[0]["cpu"], 180)}
                </div>
                <div style={{display:"flex", flexDirection:"column"}}>
                    <text style={{fontWeight:"bolder"}}>RAM:</text>
                    {progressBar(props.statusPc[0]["ram"], 180)}
                </div>
            </div>)}
            {props.statusPc && (
            <div style={{display:"flex", flexDirection:"column", marginTop:"10px"}}>
                <text style={{fontWeight:"bolder"}}>Armazenamento:</text>
                {progressBar(parseFloat(props.statusPc[0]["usedDisk"])*100/parseFloat(props.statusPc[0]["totalDisk"]), 440)}
                <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around", width:"90%"}}>
                    <text style={{fontSize:"85%"}}>Total: {props.statusPc[0]["totalDisk"]} Gb</text>
                    <text style={{fontSize:"85%"}}>Usado: {props.statusPc[0]["usedDisk"]} Gb</text>
                    <text style={{fontSize:"85%"}}>Livre: {props.statusPc[0]["freeDisk"]} Gb</text>
                </div>
            </div>
            )}

        </div>
        <h4 style={{marginBottom:"0px"}}>Status Horus</h4>
        <hr style={{height:"2px", width:"100%", borderColor:"black", backgroundColor:"black", opacity:"50%", marginTop:"2px"}}></hr>
        {props.horusHealthStatus && (
        <div tyle={{display:"flex", flexDirection:"column"}}>
            <div style={{display:"flex", flexDirection:"row", width:"100%", alignItems:"flex-start", justifyContent:"space-around", marginTop:"15px",}}>
                <div style={{display:"flex", flexDirection:"column"}}>
                    <text style={{fontWeight:"bolder", fontSize:"110%", marginBottom:"5px"}}>Workers</text>
                    {textHealthOperation(props.horusHealthStatus["runningWorkers"], props.horusHealthStatus["workerNumber"])}
                    {textHealthSeconds(props.horusHealthStatus["secondsFromLastWorkerHeatBeat"])}
                    {textHealthReset(34)}
                    {textHealthQueue(props.horusHealthStatus["queueSize"])}
                </div>
                <div style={{display:"flex", flexDirection:"column"}}>
                    <text style={{fontWeight:"bolder", fontSize:"110%", marginBottom:"5px"}}>Captures</text>
                    {textHealthOperation(props.horusHealthStatus["runningCaptures"], props.horusHealthStatus["captureNumber"])}
                    {textHealthSeconds(props.horusHealthStatus["secondsFromLastCaptureHeatBeat"])}
                    {textHealthReset(10)}
                </div>
                
            </div>
        </div>
        )}
        <div style={{display:"flex", flexDirection:"row", width:"100%", alignItems:"center", justifyContent:"space-around", marginTop:"20px"}}>

            <div style={{display:"flex", flexDirection:"column", alignItems:"center", width:"100%"}}>
                {props.statusFiles && (
                    <div style={{display:"flex", flexDirection:"column", width:"100%"}}>
                        {boolMedia && (geraMediaStatusFiles(props.statusFiles))}
                        <text style={{fontWeight:"bolder", marginBottom:"10px", marginTop:"10px", alignSelf:"center", justifySelf:"center", fontSize:"110%"}}>Arquivos alterados em {dataMedia}</text>
                        <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-around"}}>
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                                <text style={{fontWeight:"bolder", marginBottom:"5px"}}>Modificação</text>
                                <text>Arquivos criados</text>
                                <text>Arquivos apagados</text>
                            </div>
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                                <text style={{fontWeight:"bolder", marginBottom:"5px"}}>Quantidade</text>
                                <text>{pintaMedia(nCreated, mediaCreated)}</text>
                                <text>{pintaMedia(nDeleted, mediaDeleted)}</text>
                            </div>
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                                <text style={{fontWeight:"bolder", marginBottom:"5px"}}>Média</text>
                                <text>{mediaCreated}</text>
                                <text>{mediaDeleted}</text>
                            </div>
                        </div>
                    </div>
                )}

            </div>

        </div>

        <h4 style={{marginBottom:"0px"}}>Status câmeras</h4>
        <hr style={{height:"2px", width:"100%", borderColor:"black", backgroundColor:"black", opacity:"50%", marginTop:"2px"}}></hr>
        <div style={{display:"flex", flexDirection:"row", width:"100%", alignItems:"center", justifyContent:"space-around", marginTop:"20px"}}>
            <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                <text style={{fontWeight:"bolder", fontSize:"110%"}}>POV</text>
                
                {props.statusTamanho && (props.statusTamanho.map(u => {
                    let col = "#rgba(0, 0, 0, 0)"
                    let colT = "black"
                    if (parseInt(u["mb"]) > 200){
                        col = "rgba(222, 26, 26, 0.8)"
                        colT = "white"
                    }
                    return (
                    <div style={{backgroundColor:col, padding:"1px", paddingLeft:"4px", paddingRight:"4px"}}>
                        {boolTamanho && (dataStatusTamanho())}
                        <text style={{color:colT}}>{u["pov"]}</text>
                    </div>)
                }))}

            </div>

            <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>

                <text style={{fontWeight:"bolder", fontSize:"110%"}}>Tamanho (Mb)</text>
                {props.statusTamanho && (props.statusTamanho.map(u => {
                    let col = "#rgba(0, 0, 0, 0)"
                    let colT = "black"
                    if (parseInt(u["mb"]) > 200){
                        col = "rgba(222, 26, 26, 0.8)"
                        colT = "white"
                    }
                    return (
                    <div style={{backgroundColor:col, padding:"1px", paddingLeft:"4px", paddingRight:"4px"}}>
                        <text style={{color:colT}}>{u["mb"]}</text>
                    </div>)
                }))}

            </div>

            <div style={{display:"flex", flexDirection:"column"}}>

                <text style={{fontWeight:"bolder"}}>Média</text>
                <text>137 Mb</text>
                <text>203 Mb</text>
                <text>170 Mb</text>
                <text>200 Mb</text>

            </div>

        </div>

        <h4 style={{marginBottom:"0px"}}>Status SightCorp</h4>
        <hr style={{height:"2px", width:"100%", borderColor:"black", backgroundColor:"black", opacity:"50%", marginTop:"2px"}}></hr>
        <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-around", marginTop:"15px"}}>
            <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>

                <text style={{fontWeight:"bolder", fontSize:"110%"}}>POV</text>
               
                {props.statusSight && (props.statusSight.map(u => {

                    return (
                        <div style={{height:"10px", padding:"5px"}}>
                            <text>{u["pov"]}</text>
                        </div>
                    )}))}

            </div>

            <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>

                <text style={{fontWeight:"bolder", fontSize:"110%"}}>Estado</text>
                {props.statusSight && (props.statusSight.map(u => {
                    return (estadoSight(u["status"]))
                }))}

            </div>

        </div>

    </div>
    )}
    </div>
  );
}

export default Card;