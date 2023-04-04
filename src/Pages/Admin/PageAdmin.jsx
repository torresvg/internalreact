
import Admin from "../../Components/Admin/Admin";
import Navbar from "../../Components/Layouts/Navbar";
import '../../Components/css/styles.css';

function PageAdmin() {
  return (
    <div>
      <Navbar />
      <div className='container'>
        <div className="row justify-content-md-center">
          <div className="col col-lg-12">
            <Admin />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageAdmin;
