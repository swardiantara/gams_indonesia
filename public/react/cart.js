function Cart() {
  const [state, setState] = React.useState([]);

  const [zones, setZones] = React.useState({
    provinces: [],
    cities: [],
  });
  const [shipping, setShipping] = React.useState({
    provId: "",
    cityId: "",
    cities: false,
    ship: 0,
  });

  const [cost, setCost] = React.useState([]);

  React.useEffect(() => {
    const API = "/product/api/cart";
    axios
      .get(API)
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    const API = `/product/api/provinces`;
    console.log(API);
    axios
      .get(API)
      .then((res) => {
        setZones({
          provinces: [res.data.provinces.rajaongkir],
          cities: [res.data.cities.rajaongkir],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleProv = (e) => {
    setShipping({
      ...shipping,
      [e.target.name]: e.target.value,
      cities: true,
    });
  };

  const handleShipping = (e) => {
    const API = `/product/api/shipping?cityId=${shipping.cityId}`;
    axios
      .get(API)
      .then((res) => {
        setCost(res.data.rajaongkir.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTotal = (e) => {
    setShipping({
      ...shipping,
      ship: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const API = "/product/api/neworder";
    axios({
      method: "post",
      url: API,
      data: {
        item: state,
        ship: shipping.ship,
        total: total,
      },
    })
      .then((res) => {
        window.location = "/product/order-status";
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

  const subTotal = state.map((item) => item.product.price * item.qty);
  const total = subTotal.reduce((a, b) => a + b, 0);

  console.log(zones);
  console.log(shipping);
  console.log(cost.map((items) => items.costs));
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
                      {state.map((item, i) => (
                        <React.Fragment key={i}>
                          <tr className="text-right">
                            <td className="text-left">{item.product.title}</td>
                            <td>{item.qty}</td>
                            <td>{item.product.price}</td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="container-fluid mt-5 w-100">
                <div className="row">
                  <div className="col-md-6 ml-auto">
                    <div className="form-group">
                      <label>Kirim ke</label>
                      <select
                        className="form-control"
                        name="provId"
                        onChange={handleProv}
                      >
                        <option>Pilih Provinsi</option>
                        {zones.provinces.map((items) =>
                          items.results.map((item, i) => (
                            <React.Fragment key={i}>
                              <option value={item.province_id}>
                                {item.province}
                              </option>
                            </React.Fragment>
                          ))
                        )}
                      </select>
                    </div>
                    <div className="form-group">
                      <select
                        className="form-control"
                        name="cityId"
                        onChange={handleProv}
                        onClick={handleShipping}
                      >
                        <option>Pilih Kota</option>
                        {shipping.cities ? (
                          <React.Fragment>
                            {zones.cities.map((items) =>
                              items.results.map((item, i) => (
                                <React.Fragment key={i}>
                                  <option value={item.city_id}>
                                    {item.city_name}
                                  </option>
                                </React.Fragment>
                              ))
                            )}
                          </React.Fragment>
                        ) : null}
                      </select>
                    </div>

                    <div className="form-group">
                      <select
                        className="form-control"
                        name="ship"
                        onChange={handleTotal}
                      >
                        <option>Pilih Pengiriman</option>
                        {cost.map((items) =>
                          items.costs.map((item, i) => (
                            <React.Fragment key={i}>
                              <option value={item.cost.map((val) => val.value)}>
                                {item.service}
                              </option>
                            </React.Fragment>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 ml-auto pt-4">
                    <div className="table-responsive">
                      <form onSubmit={handleSubmit}>
                        <table className="table">
                          <tbody>
                            <tr>
                              <td>Sub Total</td>
                              <td className="text-right">{total}</td>
                            </tr>
                            <tr>
                              <td>Shipping</td>
                              <td className="text-right">{shipping.ship}</td>
                            </tr>
                            {/* <tr className="bg-light">
                            <td className="text-bold-800">Total</td>
                            <td className="text-bold-800 text-right">
                              {shipping.total}
                            </td>
                          </tr> */}
                          </tbody>
                        </table>
                        <button className="btn btn-primary float-right mt-4 ml-2">
                          Lanjut ke Pembayaran
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

ReactDOM.render(<Cart />, document.getElementById("cartPage"));
