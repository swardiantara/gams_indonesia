// const { response } = require("../../../routes/edit-dashboard");

$("#errorModal").modal('show');


//Accordion FAQ
$("#accordion").on("hide.bs.collapse show.bs.collapse", e => {
  $(e.target)
    .prev()
    .find("i:last-child")
    .toggleClass("fa-minus fa-plus");
});

$("#accordion").on("shown.bs.collapse", e => {
  $("html, body").animate(
    {
      scrollTop: $(e.target)
        .prev()
        .offset().top
    },
    400
  );
});

const sekarang = new Date();
let countDownDate = sekarang.setDate(sekarang.getDate() + 2);
var x = setInterval(function () {

  // Untuk mendapatkan tanggal dan waktu hari ini
  var now = new Date().getTime();

  // Temukan jarak antara sekarang dan tanggal hitung mundur
  var distance = countDownDate - now;

  // Perhitungan waktu untuk hari, jam, menit dan detik
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Keluarkan hasil dalam elemen dengan id = "demo"
  document.getElementById("countdown").innerHTML = days + " : " + hours + " : "
    + minutes + " : " + seconds + " ";

  // Jika hitungan mundur selesai, tulis beberapa teks 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "Promo Berakhir";
  }
}, 1000);

function getUrlVars() {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

$('#formRegister').on('submit', function (e) {
  e.preventDefault();
  let currentUrl = getUrlVars();
  console.log(currentUrl)
  let referralCode = getUrlVars()['referralCode'] || "";
  let funnel = getUrlVars()['funnel'] || "";
  console.log(referralCode);
  console.log(funnel)
  let data = $(this)
  console.log(data.serialize());
  $.ajax({
    type: 'POST',
    url: `/register${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`,
    data: data.serialize(),
    // success: function (response) {
    //   console.log(response)
    //   alert('Success')
    // }
  }).done((response) => {
    // response = response.responseJSON;
    console.log(response)
    Swal.fire({
      icon: "success",
      title: "Pendaftaran Berhasil!",
      text: 'Silahkan cek email untuk melihat detail order!',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `${response.baseURL}${response.routeQuery.referralCode ? "?referralCode=" + response.routeQuery.referralCode : ""}${response.routeQuery.funnel ? "&funnel=" + response.routeQuery.funnel : ""}`
      }
    });
    // console.log(response)
    // alert('Success')
  }).fail((error) => {
    console.log(error.responseJSON)
    Swal.fire({
      icon: "error",
      title: "Gagal!",
      text: `${error.responseJSON.message}`,
    })
    // .then((result) => {
    //   if (result.isConfirmed) {
    //     window.location.href = `${response.baseURL}${response.routeQuery.referralCode ? "?referralCode=" + response.routeQuery.referralCode : ""}${response.routeQuery.funnel ? "&funnel=" + response.routeQuery.funnel : ""}`
    //   }
    // });
    // alert('Fail')
  })
})

$('#formVideo').on('submit', function (e) {
  e.preventDefault();
  let currentUrl = getUrlVars();
  console.log(currentUrl)
  let referralCode = getUrlVars()['referralCode'] || "";
  let funnel = getUrlVars()['funnel'] || "";
  console.log(referralCode);
  console.log(funnel)
  let data = $(this)
  console.log(data.serialize());
  $.ajax({
    type: 'POST',
    url: `/freevideo${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`,
    data: data.serialize(),
    // success: function (response) {
    //   console.log(response)
    //   alert('Success')
    // }
  }).done((response) => {
    // response = response.responseJSON;
    console.log(response)
    Swal.fire({
      icon: "success",
      title: "Pendaftaran Berhasil!",
      html: `<p>Terima kasih, 10 Video tersebut akan kami kirimkan mulai besok.</p>
      <p>Sebelum itu, Anda bisa langsung menonton video GAMS yang membahas detail tentang: </p>
      <p>"Langkah Pertama Membangun Bisnis & Menghasilkan Income Dari Internet Mulai Dari Bulan Pertama."</p>
      <p><span class="text-danger"><strong>*</strong></span>kami sangat menyarankan Anda segera menonton video tersebut sampai habis, agar Anda lebih bisa memahami 10 video yang akan kami kirim ke depannya.</p>`,
      confirmButtonText: 'Tonton Video'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `${response.baseURL}${response.routeQuery.referralCode ? "?referralCode=" + response.routeQuery.referralCode : ""}${response.routeQuery.funnel ? "&funnel=" + response.routeQuery.funnel : ""}#videoAwal`
      }
    });
    // console.log(response)
    // alert('Success')
  }).fail((error) => {
    console.log(error.responseJSON)
    Swal.fire({
      icon: "error",
      title: "Gagal!",
      text: `${error.responseJSON.message}`,
    })
    // .then((result) => {
    //   if (result.isConfirmed) {
    //     window.location.href = `${response.baseURL}${response.routeQuery.referralCode ? "?referralCode=" + response.routeQuery.referralCode : ""}${response.routeQuery.funnel ? "&funnel=" + response.routeQuery.funnel : ""}`
    //   }
    // });
    // alert('Fail')
  })
})