'use strict'

var base_server = 'https:/solvine.online/API/'; 
var lcontainer = "#container";
var local = localStorage;
var parsed;
    //var toastID = document.getElementById('toast-1'); 
    //toastID = new bootstrap.Toast(toastID);
    

$(document).ready(function() {
    bind_view();
    bind_form();
    if('userdata' in local) {
        if(local.userdata == "undefined" || local.userdata == '') {
            local.clear();
        } else {
            data_repl('userdata',function(r){
                bind_view();
                bind_form();
                if(r) $('#preloader').addClass('preloader-hide');
                setInterval(function() { refresh_data() }, 11000);
            });
        }
    } else {
        $('#preloader').addClass('preloader-hide');
    }
});

function refresh_data() {
   $.ajax({
        url: base_server+'get_data',
        type: "POST",
        dataType: 'JSON',
        data: 'id=007',
        asyc: true,
        success: function(r) {
            if(r.status == 'success') {
                local.userdata = JSON.stringify(r.userdata);
                local.pal = JSON.stringify(r.pal);
            } else {
                if(r.code == "300") {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error Code: '+r.code,
                      text: r.msg,
                    });
                    local.clear();
                    javascript:location.replace('index.html');
                }
            }
        },
        error: function(r) {
            console.log('ERROR: '+r);
        }
    });
}
function bind_view() {      
    $('[view="true"]').off('click');
    $('[view="true"]').on('click',function(e) {
        var attr = $(this).attr('view-data');
        if (typeof attr !== 'undefined' && attr !== false && attr !== '') {
            local.view_data = attr;
        }
        var caller = $(this);
        var click_path = caller.attr('path');
        loader(click_path);
    });
    return;
}

function get_token(){
    parsed = JSON.parse(local.userdata);
    return parsed.token;
}
function get_uid(){
    parsed = JSON.parse(local.userdata);
    return parsed.id;
}
function bind_form() {
    $('form[newjs="true"]').off('submit');
    $('form[newjs="true"]').on('submit',function(e) {
        e.preventDefault();
        var path = $(this).attr('action');
        var data = $(this).serialize();
        $('#preloader').removeClass('preloader-hide');
        poster(path, data, function(r) {
            setTimeout(function() {
                $('#preloader').addClass('preloader-hide');
                if(r.login) {
                    if(r.status == 'success') {
                        $('#buttonsukses').click();
                        $('#suksesstats').html(r.msg);
                        console.log(r.serverinfo);
                        local.userdata = JSON.stringify(r.userdata);
                        local.stock = JSON.stringify(r.stock);
                        local.invoice = JSON.stringify(r.invoice);
                        local.invoice_ngutang = JSON.stringify(r.invoice_ngutang);
                        setTimeout(function() { javascript:location.replace('home.html'); }, 2000);
                    }else{
                        $('#buttonerror').click();
                        $('#errorstats').html(r.msg);
                        $('#kodestats').html(r.code);
                    }
                } else {
                    if(r.status == 'success') {
                        $('#buttonsukses').click();
                        $('#suksesstats').html(r.msg);
                        $('#imgnya').attr('src', r.img);
                        if(r.search == 'true'){
                            local.invoice_result = JSON.stringify(r.invoice_result);
                            $('#resultinvoice').click();
                        }
                    } else {
                       $('#buttonerror').click();
                        $('#errorstats').html(r.msg);
                        $('#kodestats').html('Kode Kesalahan: '+r.code);
                    }
                    if(r.create_invoice == 'true'){
                        $('#buttonsukses1').click();
                        $('#suksesstats1').html(r.msg);
                    }

                }
            }, 2000);
        });
    });
}

function getWholeData(lsign) {
    var result;
    $.ajax({
        url: base_server+'userdata',
        type: 'post',
        dataType: 'json',
        data: 'token='+lsign,
        beforeSend: function() {
            // maybe do something?
        },
        error: function(e) {
            call_error(e);
        },
        success: function(r) {
            result = r;
            // do something
        }
    });
    return result;
}
function loader(path, target = lcontainer,locate_data='userdata') {
    $.ajax({
        url: "view/"+path,
        type: 'get',
        dataType: 'html',
        beforeSend: function() {
            $('#preloader').removeClass('preloader-hide');
        },
        complete: function() {
            setTimeout(function() {
                $('#preloader').addClass('preloader-hide');
            }, 1000);
        },
        success: function(r) {
            place_data(r,locate_data, function(res) {
                $(target).html(res);
                bind_view();
                bind_form();
            });
        },
        error: function(r) {
            alert('Terjadi Kesalahan..');
            javascript:location.replace('index.html');
        }
    });
    /*
    $(target).load("view/"+path, function(response, status, xhr ) {
        if(status !== 'error') {
            data_repl(locate_data,function(r) {
                if(r) {
                    $('#preloader').addClass('preloader-hide');
                }
            });
            bind_view();
            bind_form();
        } else {
            alert('Terjadi kesalahan..');
        }
    });
    */
    return true;
};
function poster(path, posted, callback) {
    var result;
    $.ajax({
        url: base_server+path,
        type: 'post',
        dataType: 'JSON',
        data: posted,
        beforeSend: function() {
            //$('#toast-1').toast('show');
        },
        complete: function() {
            //$('#toast-1').toast('hide');
        },
        success: function(r) {
            callback(r);
        }
    });
};

function data_repl(locate_data='userdata',callback) {
    place_data($(lcontainer).html(),locate_data, function(cb) {
        $(lcontainer).html(cb);
        checkDOM();
        //Image Sliders
        var splide = document.getElementsByClassName('splide');
        if(splide.length){
            var singleSlider = document.querySelectorAll('.single-slider');
            if(singleSlider.length){
                singleSlider.forEach(function(e){
                    var single = new Splide( '#'+e.id, {
                        type:'loop',
                        autoplay:true,
                        interval:4000,
                        perPage: 1,
                    }).mount();
                    var sliderNext = document.querySelectorAll('.slider-next');
                    var sliderPrev = document.querySelectorAll('.slider-prev');
                    sliderNext.forEach(el => el.addEventListener('click', el => {single.go('>');}));
                    sliderPrev.forEach(el => el.addEventListener('click', el => {single.go('<');}));
                });
            }

            var doubleSlider = document.querySelectorAll('.double-slider');
            if(doubleSlider.length){
                doubleSlider.forEach(function(e){
                     var double = new Splide( '#'+e.id, {
                        type:'loop',
                        autoplay:true,
                        interval:4000,
                        arrows:false,
                        perPage: 2,
                    }).mount();
                });
            }

            var tripleSlider = document.querySelectorAll('.triple-slider');
            if(tripleSlider.length){
                tripleSlider.forEach(function(e){
                     var triple = new Splide( '#'+e.id, {
                        type:'loop',
                        autoplay:true,
                        interval:4000,
                        arrows:false,
                        perPage: 3,
                        perMove: 1,
                    }).mount();
                });
            }

            var quadSlider = document.querySelectorAll('.quad-slider');
            if(quadSlider.length){
                quadSlider.forEach(function(e){
                     var quad = new Splide( '#'+e.id, {
                        type:'loop',
                        autoplay:true,
                        interval:4000,
                        arrows:false,
                        perPage: 4,
                        perMove: 1,
                    }).mount();
                });
            }
        }
    });
    callback(true);
}

function place_data(page,locate_data = "userdata", callback) {
    parsed = JSON.parse(local[locate_data]);
    var explosion = page.split("[|]");
    var tags = [];
    var new_page = page;
    
    if(explosion.length > 0) {
        for(var i =1; i<explosion.length;) {
            tags.push(explosion[i]);
            i=i+2;
        }
        for(var b=0;b<tags.length;b++) {
            var rep = tags[b];
            new_page = new_page.replace("[|]"+tags[b]+"[|]",parsed[tags[b]]);
        }
    }
    callback(new_page);
    return true;
}

function checkDOM() {
    if($('[foreach="true"]').length) {
        parsed = JSON.parse(local.userdata);
        console.log(parsed.token);
        var key = $('[foreach="true"]').attr('data-from');
        
        if(parsed[key].count > 0) {
            $.each(parsed[key].data, function( k , val) {
                eachRow(val, $('[data-from="'+key+'"]'));
            });
        }
    }
}   

function eachRow(row, el) { 
    var html;
    
    
    html = $('<tr></tr>')
      .append($('<th></th>')
        .attr({ scope : 'row' })
        .html(row.judul))
      .append($('<td></td>')
        .addClass('color-green-dark')
        .html(row.created_at))
      .append($('<td></td>')
        .addClass('color-green-dark')
        .append($('<a></a>')
          .attr('href','#')
          .addClass('btn btn-3d btn-m btn-full mb-3 rounded-m text-uppercase font-300 shadow-s  '+ (row.open == 1 ? 'border-green-dark bg-green-light': 'border-red-dark bg-red-light'))
          .html(row.status)
        )
      )
      
    el.append(html);
    
    /*
    th = document.createElement('th').setAttribute('scope','row')
    th.innerHTML = 'BlaBlaBla...';
    tr.append(th);
    
    td = document.createElement('td').addClass('color-green-dark')
    td.innerHTML = '12/12/12';
    tr.append(td)
    
    td = document.createElement('td').addClass('color-green-dark');
    a = document.createElement('a').addClass('btn btn-3d btn-m btn-full mb-3 rounded-m text-uppercase font-300 shadow-s  border-green-dark bg-green-light')
    a.setAttribute('href','#');
    td.append(a);
    tr.append(td)
    */
    
    
}

function logout() {
    local.clear();
    Swal.fire({
      icon: 'success',
      title: 'Logged out!',
      text: 'Anda akan dialihkan kehalaman login..',
    });
    setTimeout(function() { javascript:location.replace('index.html'); }, 2000);
    return true;
}

function call_error(e) {
    // CALL ERROR MODAL? //
}