import Head from "next/head";
import Login from "./components/login2";

export default function Home()  {
return (<>
  <Head>
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  </Head>
  <div className="bg-blue-100">
  <p>nouvelle tentative</p>
  <Login/>
  </div>
</>)
;}
