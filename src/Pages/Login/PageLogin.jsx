import Login from "../../Components/Login/Login";
import '../../Components/css/styles.css';

function PageLogin() {
  return (
    <body>
    <div>
      <div className='container' style={{marginTop: "40px"}}>
        <div className="row justify-content-md-center">
          <div className="col col-lg-6" style={{border: "40px"}}>
            <Login />
          </div>
        </div>
      </div>
    </div>
    </body>
  );
}

export default PageLogin;
