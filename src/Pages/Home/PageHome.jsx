import Dashboard from "../../Components/Home/Dashboard";
import Navbar from "../../Components/Layouts/Navbar";


function PageHome() {
  return (
    <div style={{ 
      backgroundImage: "url(./fondo.png})",
      backgroundRepeat: "no-repeat"
    }}>
      <Navbar />
      <div className='container'>
        <div className="row justify-content-md-center">
          <div className="col col-lg-10">
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageHome;
