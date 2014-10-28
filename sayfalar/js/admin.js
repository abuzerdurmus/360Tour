var fotoUrl="";
function AdminFotograflariListele(tabloAdi)
{
 wsGet('/fotograf/tumfotograflarilistele',
          function(err,resp){
              if(err){
                  alert(err);
                  return;
              }              
            for(var i=0;i < resp.length;i++){ 
            
            var tr=$("<tr id="+resp[i]._id+"></tr>");
            $("#"+tabloAdi).find("tbody").append(tr); 
            tabloyaSatırEkle(fotoToArr(resp[i]),tr); 
            tabloyaButonEkle(resp[i]._id,tr);
            }
              
          });   
}

function fotografEkle(){
    
  $("#btnEkle").click(function(){
      
      var date=new Date();
      
      var fotografObj={
                          url          :  fotoUrl,
                          ad           :  $("#inpAd").val(),
                          sehir        :  $("#inpSehir").val(),
                          ulke         :  $("#inpUlke").val(),
                          kategori     :  $( "#slctKategori option:selected" ).val(),
                          eklemeTarihi :  date.getDate()+"."+date.getMonth()+"."+date.getFullYear(),
                          aciklama     :  $("#txtAciklama").val()
                      };     
      
        console.log(fotografObj.url);
        var requiredFieldValidator = true;
        $(".required").each(function(index,elem){
            if(!$(elem).val().trim())
                {
                    $(elem).css("border-color","red");
                    requiredFieldValidator=false;
                }
                else {
					$(elem).css("border-color","");
                }
        });
          if(requiredFieldValidator)
        {
      wsPost("/fotograf/ekle",fotografObj,
            function(err,data){
               
               if(err)
               {
                  console.log(JSON.stringify(err));
                   return;
               }
                 var tr=$("<tr id="+data._id+"></tr>");
                 $("#tblFotoListeleAdmin").find("tbody").append(tr);
                 
                 tabloyaSatırEkle(fotoToArr(fotografObj),tr);
                 tabloyaButonEkle(data._id,tr);               
           });
             
            $("#divFotografEkle input[type='text'],textarea").val("");
        }
        });
}
function kategoriDoldur(ddlKategori){
    
     $("#"+ddlKategori).children().remove();
    wsGet("/kategori/tumkategorilerilistele",function(err,data){
    
        if(err){
         
            console.log(JSON.stringify(err));
            return;
        }
        for(var i=0;i<data.length;i++)
        {
          $("#"+ddlKategori).append("<option id='"+data[i]._id+"' value='"+data[i].kategori+"'>"+data[i].kategori+"</option>");
        }
    });
}
function kategoriEkle(){

    $("#btnKategoriEkle").click(function(){
        
        var data={ kategori : $("#inpKategoriEkle").val()};
        wsPost("/kategori/ekle",data,function(err,resp){
           
            if(err)            
            {
                console.log(JSON.stringify(err));
                return;
            }
            $("#slctKategori").append("<option id='"+resp._id+"' value='"+data.kategori+"'>"+data.kategori+"</option>");
            
        });
        $("#inpKategoriEkle").val("");
    });
}
function kategoriSil()
{
  $("#btnKategoriSil").click(function(){
      var opId=$("#slctKategori option:selected" ).attr("id");
      var data={_id : opId};
      console.log(opId);
      wsPost("/kategori/sil",data,function(err,resp){
        if(err){
          console.log(JSON.stringify(err));
            return;
        }
          $( "#slctKategori option:selected" ).remove();
      });
      
  });
}
function tablodaSatirGuncelle(tabloAdi)
{
  var fotografUrl="";
  $("#"+tabloAdi).on("click",".guncelle",function(){
      
      tr=$("#"+tabloAdi).find("tbody").find("tr[id="+this.id+"]");
      $("#h5GuncelleId").html(this.id);
      $("#inpGuncelleAd").val(tr.find("td").eq(1).text()); 
      $("#inpGuncelleSehir").val(tr.find("td").eq(2).text());
      $("#inpGuncelleUlke").val(tr.find("td").eq(3).text());
      $("#slctGuncelleKategori").val(tr.find("td").eq(4).text());
      $("#txtGuncelleAciklama").val(tr.find("td").eq(6).text());
      fotografUrl=tr.find("td").eq(0).find("a").attr("href");
  });
     $("#btnGuncelle").bind("click",function(){
      
        var guncelFotografObj={
                                _id          :$("#h5GuncelleId").html(),
                                url          :fotografUrl,
                                ad           :$("#inpGuncelleAd").val(),
                                sehir        :$("#inpGuncelleSehir").val(),
                                ulke         :$("#inpGuncelleUlke").val(),
                                kategori     :$("#slctGuncelleKategori option:selected").val(),
                                aciklama     :$("#txtGuncelleAciklama").val()                                
                              };
         wsPost("/fotograf/guncelle",guncelFotografObj,function(err,data){
         
             if(err){
             
                 console.log(JSON.stringify(err));
                 return;
             }
             tr.find("td").remove();
             tabloyaSatırEkle(fotoToArr(guncelFotografObj),tr);
             tabloyaButonEkle(guncelFotografObj._id,tr);
         
         });
        
    });
}


$(document).ready(function(){
    
    $("#resimBilgileri #btnYukle").on("click",function(e){
       if(!$("#inpResimYukle").val())
       {
            e.preventDefault(); 
            return;   
       }
    });   
     
    jQuery('#formResimYukle').ajaxForm(function(data) { 
        var resp=JSON.parse(data);
        fotoUrl=resp.url;
        $( "#resimBilgileri" ).prepend();
       // $('#inpResimYukle').val('');  
        //console.log(data);
    }); 
    
    AdminFotograflariListele("tblFotoListeleAdmin");
    tablodanSil("tblFotoListeleAdmin","/fotograf/sil");
    fotografEkle();
    tablodaSatirGuncelle("tblFotoListeleAdmin");
    kategoriEkle();
    kategoriDoldur("slctKategori");
    kategoriDoldur("slctGuncelleKategori");
    kategoriSil();
});







