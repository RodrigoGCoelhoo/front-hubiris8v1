import logo from "./assets/logo.png";
import './App.css';
import Card from './components/Card.js'
import { useState, useEffect } from 'react';
import Axios from 'axios';
import https from 'https';

let healthjson = require("./heatlhstatus.json");

let base64 = require('base-64');

function App() {

  const [statusPc, setStatusPc] = useState(null);
  const [statusFiles, setStatusFiles] = useState(null);
  const [statusTamanho, setStatusTamanho] = useState(null);
  const [statusSight, setStatusSight] = useState(null);

  const [clientes, setClientes] = useState(null);
  const [clienteUnidade, setClienteUnidade] = useState(null);
  const [clienteUnidadeEnd, setClienteUnidadeEnd] = useState(null);

  const [errStatusFiles, setErrStatusFiles] = useState(true);
  const [errStatusTamanho, setErrStatusTamanho] = useState(true);
  const [errStatusSight, setErrStatusSight] = useState(true);

  const [unidade, setUnidade] = useState("General");

  const headers = {
    'Content-Type': 'application/json',
  };

  const username_ = "faad25eb8bda40d0bffa519f56ff7b95@iris8.com.br";
  const password_ = "4fad71be-96ef-4728-abd8-ba5e50763cf9";
  const basicAuth = 'Basic ' + btoa(username_ + ":" + password_);
  const base64data = basicAuth.toString('base64');

  const agent = new https.Agent({  
    rejectUnauthorized: false
   });

  async function getData () {

      Axios.get('https://hubiris8.herokuapp.com/hubapi/clientes', {headers})
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });

      Axios.get('https://hubiris8.herokuapp.com/hubapi/statuspc', {headers})
            .then((response) => {
                setStatusPc(response["data"]);
            })
            .catch((error) => {
                console.log(error);
            });

      Axios.get('https://hubiris8.herokuapp.com/hubapi/statusfiles', {headers})
            .then((response) => {
                setStatusFiles(response["data"]);
                setErrStatusFiles(false);
            })
            .catch((error) => {
                console.log(error);
            });

      Axios.get('https://hubiris8.herokuapp.com/hubapi/tamanhofiles', {headers})
            .then((response) => {
              setStatusTamanho(response["data"]);
              setErrStatusTamanho(false);
            })
            .catch((error) => {
                console.log(error);
            });

      Axios.get('https://hubiris8.herokuapp.com/hubapi/statussightcorp', {headers})
            .then((response) => {
                setStatusSight(response["data"]);
                setErrStatusSight(false);
            })
            .catch((error) => {
                console.log(error);
            });

      Axios.get('https://www.generalshopping.iris8.com.br/api/health/status', {}, {
          headers: { 'Authorization': + basicAuth }
      
          })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
      

      fetch("https://www.generalshopping.iris8.com.br/api/health/status", {
          headers: new Headers({
            "Authorization": `Basic ${base64.encode(`${username_}:${password_}`)}`,
            'Content-Type': 'application/json',
          }),
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });


  }

  function filterData (dic, id) {
    let dicFinal = [];
    for (let u in dic){
      if (dic[u]["id"] === id){
        dicFinal.push(dic[u]);
      }
    }
    return (dicFinal);
  }

  function onClickFilter(){
    filterData(statusFiles, 2);
  }

  const cLog = () => {
    //console.log(shoppings);
    //console.log(statusPc);
    //console.log(statusFiles);
    //console.log(statusTamanho);
    console.log(statusSight);
  }

  function changeUnidade(u){
    setUnidade(u);
  }

  function buttonSideBar (unit) {
    return (
      (unidade === unit) ? (
        <button onClick={()=> changeUnidade(unit)} style={{fontSize:"115%", fontWeight:"bolder", borderTop:"0px", borderLeft:"0px", borderRight:"0px", height:"40px", borderColor:"black", backgroundColor:"#01C1D4", color:"white"}}>{unit}</button>
      ) : (
        <button onClick={()=> changeUnidade(unit)} style={{fontSize:"115%", fontWeight:"bolder", borderTop:"0px", borderLeft:"0px", borderRight:"0px", height:"40px", borderColor:"black"}}>{unit}</button>
      ))}

  useEffect(() => {

    getData();

  }, []);

  return (
    <div style={{display:"flex", flexDirection:"row", width:"100% !important", height:"100% !important"}}>
      <div style={{position:"fixed", width:"10%", minWidth:"200px", minHeight:"100vh", backgroundColor:"#DFE0E2", boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", 
                   display:"flex", flexDirection:"column"}}>
        <img src={logo} width="95%" style={{margin:"5px", marginTop:"20px"}}/>
        <div style={{display:"flex", flexDirection:"column", marginTop:"20px"}}>
          <div style={{width:"100%", height:"1px", backgroundColor:"black"}}></div>
          {buttonSideBar("General Shopping")}
          {buttonSideBar("BrMalls")}
          {buttonSideBar("Biomundo")}
          {buttonSideBar("Giraffas")}
          {buttonSideBar("Volkswagen")}
        </div>
      </div>
      <div style={{width:"10%", minWidth:"200px"}}></div>
      <div style={{position:"relative", display:"flex", flexDirection:"row", flexFlow:"row wrap", width:"100%", marginLeft:"20px"}}>
        {unidade === "General Shopping" && (
        <Card 
        
              statusPc = {filterData(statusPc,74)}
        
              horusHealthStatus = {healthjson[0]}
              errHorusHealthStatus = {false}

              statusFiles = {filterData(statusFiles,74)}
              errStatusFiles = {errStatusFiles}

              statusTamanho = {filterData(statusTamanho,74)}
              errStatusTamanho = {errStatusTamanho}

              statusSight = {filterData(statusSight,74)}
              errStatusSight = {errStatusSight}
        ></Card>)}
        {unidade === "BrMalls" && (
        <Card horusHealthStatus = {healthjson[0]}
              errHorusHealthStatus = {false}

              statusPc = {filterData(statusPc,75)}

              statusFiles = {filterData(statusFiles,75)}
              errStatusFiles = {errStatusFiles}

              statusTamanho = {filterData(statusTamanho,75)}
              errStatusTamanho = {errStatusTamanho}

              statusSight = {filterData(statusSight,75)}
              errStatusSight = {errStatusSight}
        ></Card>)}

      </div>
    </div>
  );
}

export default App;
