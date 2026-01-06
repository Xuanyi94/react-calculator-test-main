import { useState } from "react";
import "./App.css";
import Layout from "./components/Layout";

const base =
  "h-16 flex items-center justify-center text-xl font-semibold rounded-lg cursor-pointer transition hover:bg-gray-200 active:scale-95";

function App() {
  const [input, setInput] = useState("0");   // 目前輸入
  const [prev, setPrev] = useState("");      // 前一個數
  const [op, setOp] = useState("");          // 運算符
  const [done, setDone] = useState(false);   // 是否剛按完 =

  const btns = [
    "%","CE","C","⌫",
    "1/x","x²","²√x","÷",
    "7","8","9","×",
    "4","5","6","−",
    "1","2","3","+",
    "±","0",".","=",
    
  ];

  const calc = (a:number,b:number,sign:string)=>{
    switch(sign){
      case "+": return a+b;
      case "−": return a-b;
      case "×": return a*b;
      case "÷": return b===0 ? NaN : a/b;
      default: return b;
    }
  };

  const handle = (s:string)=>{
    const num = !isNaN(Number(s));

    // 數字
    if(num){
      if(done){ setInput(s); setDone(false); return; }
      setInput(input==="0" ? s : input+s);
      return;
    }

    // .
    if(s==="."){
      if(!input.includes(".")) setInput(input+".");
      return;
    }

    // CE 清除目前
    if(s==="CE"){ setInput("0"); return; }

    // C 全部清
    if(s==="C"){ setInput("0"); setPrev(""); setOp(""); return; }

    // 退格
    if(s==="⌫"){
      setInput(input.length>1 ? input.slice(0,-1) : "0");
      return;
    }

    // 正負
    if(s==="±"){ setInput(String(Number(input)*-1)); return; }

    // %
    if(s==="%"){ setInput(String(Number(input)/100)); return; }

    // 單鍵運算
    if(s==="1/x"){ setInput(String(1/Number(input))); return; }
    if(s==="x²"){ setInput(String(Math.pow(Number(input),2))); return; }
    if(s==="²√x"){ setInput(String(Math.sqrt(Number(input)))); return; }

    // =
    if(s==="="){
      if(!prev || !op) return;
      const result = calc(Number(prev),Number(input),op);
      setInput(String(result));
      setPrev("");
      setOp("");
      setDone(true);
      return;
    }

    // + - × ÷
    if(["+","−","×","÷"].includes(s)){
      if(prev && op && !done){
        const result = calc(Number(prev),Number(input),op);
        setPrev(String(result));
      }else{
        setPrev(input);
      }
      setInput("0");
      setOp(s);
      setDone(false);
      return;
    }
  };

  return (
    <Layout>
      <div className="max-w-sm mx-auto p-6 rounded-2xl bg-white shadow-2xl">
        <input
          value={input}
          readOnly
          className="w-full h-20 bg-green-100 rounded-xl text-right text-4xl px-4 shadow-inner mb-4"
        />

        <div className="grid grid-cols-4 gap-2">
          {btns.map((b,i)=>(
            <div key={i} className={base} onClick={()=>handle(b)}>
              {b}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default App;
