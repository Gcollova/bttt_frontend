import { Routes, Route, Outlet, Link } from "react-router-dom";
import { CheckName } from './pages/CheckName';
import { Home } from './pages/Home';
import styles from './app.module.scss';
import { useState } from "react";


export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="check-name" element={<CheckName />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
  );
}
const links =  [{path:'/',name:'Home'},{path:'/check-name',name:'Check Name'},{path:'/collect-name',name:'Collect Name'}];

function Layout() {
  const [selected,setSelected] = useState<string>('/');
  return (
    <div className={styles.main}>
      <nav className={styles._nav}>
        <ul className={styles.__list}>
          {links.map((item,index) =>{
            return(
              
              <li key={index.toString() + item.name} className={`${styles.___listItem} ${selected === item.path && styles.selected}`}>
                <Link onClick={()=> setSelected(item.path)} to={item.path}>{item.name}</Link>
              </li>

            )
          })}                
        </ul>
      </nav>
      
      <Outlet />
    </div>
  );
}




function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}