function MemberOrder() {
  const [state, setState] = React.useState([]);

  const [input, setInput] = React.useState({
    paket: "",
  });

  React.useEffect(() => {
    const API = "/membership/api/list";
    axios
      .get(API)
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleInput = (e) => {
    setInput({
      paket: e,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const API = `/membership/api/order`;
    axios({
      method: "POST",
      url: API,
      data: {
        paket: input.paket,
      },
    })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Lakukan Pembayaran ke",
          html: "<b>BCA a.n DENNIS GERALDI</b> <br>" + "<p>8480216203</p>",
          footer:
            "<a href='https://wa.me/6283877607433?text=Saya%20mau%20konfirmasi%20pembayaran'>Lakukan konfirmasi pembayaran disini</a>",
        });
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

  console.log(state);
  console.log(input);
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h4 className="text-center mb-3 mt-4">Choose a plan</h4>
              <p className="text-muted text-center mb-4 pb-2">
                Choose the features and functionality your team need today.
                Easily upgrade as your company grows.
              </p>
              <div className="container">
                <div className="row">
                  {state.map((item, i) => (
                    <React.Fragment key={i}>
                      <div className="col-md-6 stretch-card grid-margin grid-margin-md-0">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="text-center text-uppercase mt-3 mb-4">
                              {item.name}
                            </h5>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="feather feather-award text-primary icon-xxl d-block mx-auto my-3"
                            >
                              <circle cx={12} cy={8} r={7} />
                              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                            </svg>
                            <h3 className="text-center font-weight-light">
                              Rp {item.price}
                            </h3>
                            <p className="text-muted text-center mb-4 font-weight-light">
                              sekali bayar
                            </p>
                            <h6 className="text-muted text-center mb-4 font-weight-normal">
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: item.description,
                                }}
                              />
                            </h6>

                            <form onSubmit={handleSubmit}>
                              {item.price === 0 ? (
                                <button
                                  className="btn btn-primary d-block mx-auto mt-4"
                                  disabled
                                >
                                  Order
                                </button>
                              ) : (
                                <button
                                  className="btn btn-primary d-block mx-auto mt-4"
                                  onClick={() => handleInput(`${item._id}`)}
                                >
                                  Order
                                </button>
                              )}
                            </form>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

ReactDOM.render(<MemberOrder />, document.getElementById("memberOrder"));
