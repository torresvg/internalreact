import Upload from "../../Components/Admin/Upload";
import Navbar from "../../Components/Layouts/Navbar";
import '../../Components/css/styles.css';

function PageDocumento() {
  return (
    <div >
      <Navbar />
      <div className='container'>
        <div className="row justify-content-md-center">
          <div className="col col-lg-10">
            <Upload />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageDocumento;