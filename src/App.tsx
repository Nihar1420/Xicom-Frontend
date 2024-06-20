import FormComponent from "./components/FormComponent";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <FormComponent />
    </div>
  );
}

export default App;
