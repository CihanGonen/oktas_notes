import "./Home.css";
export default function Home() {
  return (
    <div className="cardhome">
      <label>not ekle : </label>
      <div>
        <textarea className="textarea" />
      </div>
      <input className="button" type="submit" value="Submit" />
      <div class="click">
        <span class="fa fa-star-o"></span>
        <div class="ring"></div>
        <div class="ring2"></div>
      </div>
    </div>
  );
}
