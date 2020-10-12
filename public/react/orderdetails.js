function OrderDetails() {
  const [state, setState] = React.useState([]);

  const [input, setInput] = React.useState({
    pay: "",
  });

  React.useEffect(() => {
    const API = `${location.pathname}`;
    console.log(API);
    axios
      .get(API + "/api")
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    setInput({
      pay: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const API = `${location.pathname}`;
    axios({
      method: "POST",
      url: API + "/api",
      data: input,
    })
      .then((res) => {
        console.log(res);
        if (res.data.paymentMethod === "bca") {
          Swal.fire({
            icon: "success",
            title: "Lakukan Pembayaran ke",
            html:
              "<b>BCA a.n DENNIS GERALDI</b> <br>" +
              "<p>8480216203</p> " +
              `<br> Rp. ${hasilTotal}`,
            footer:
              "<a href='https://wa.me/6283877607433?text=Saya%20mau%20konfirmasi%20pembayaran'>Lakukan konfirmasi pembayaran disini</a>",
          });
        }

        if (res.data.paymentMethod === "mandiri") {
          Swal.fire({
            icon: "success",
            title: "Lakukan Pembayaran ke",
            html:
              "<b>MANDIRI a.n DENNIS GERALDI</b> <br>" +
              "<p>132-00-2284551-6</p>" +
              `<br> Rp. ${hasilTotal}`,
            footer:
              "<a href='https://wa.me/6283877607433?text=Saya%20mau%20konfirmasi%20pembayaran'>Lakukan konfirmasi pembayaran disini</a>",
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: "<a href>Silahkan coba kembali nanti</a>",
        });
      });
  };

  const totalOrder = state.map((item) => item.total);
  const hasilTotal =
    parseInt(totalOrder) + parseInt(Math.random().toString().substr(2, 2));
  console.log(hasilTotal);
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="container-fluid mt-5 d-flex justify-content-center w-100">
                <div className="table-responsive w-100">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th className="text-right">Quantity</th>
                        <th className="text-right">Unit cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      <React.Fragment>
                        {state.map((data) =>
                          data.item.map((prod, i) => (
                            <React.Fragment key={i}>
                              <tr className="text-right">
                                <td className="text-left">
                                  {prod.product.title}
                                </td>
                                <td>{prod.qty}</td>
                                <td>{prod.product.price}</td>
                              </tr>
                            </React.Fragment>
                          ))
                        )}
                      </React.Fragment>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="container-fluid mt-5 w-100">
                <div className="row">
                  <div className="col-md-6 ml-auto">
                    <label>Pilih Metode Pembayaran</label>

                    <div className="pl-4 pr-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="pay"
                          defaultValue="bca"
                          onChange={handleChange}
                        />
                        <label className="form-check-label">
                          Bank Central Asia
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="pay"
                          defaultValue="mandiri"
                          onChange={handleChange}
                        />
                        <label className="form-check-label">Bank Mandiri</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 ml-auto pt-4">
                    <div className="table-responsive">
                      <form>
                        <table className="table">
                          <tbody>
                            <tr>
                              <td>Shipping</td>
                              <td className="text-right">
                                {state.map((item) => item.shippingCost)}
                              </td>
                            </tr>
                            <tr>
                              <td>Total</td>
                              <td className="text-right">
                                {state.map((item) => item.total)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <button
                          className="btn btn-primary float-right mt-4 ml-2"
                          onClick={handleSubmit}
                        >
                          Bayar Sekarang
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

ReactDOM.render(<OrderDetails />, document.getElementById("orderDetailsPage"));
