
var root="http://localhost:3000/";
var globalroot="http://localhost:3000/";

//var used to store the id of currently updating object
var updateObjectId=null;

var liveVideoList=null;
var messageList=null;
var eventEditor=null;
var newsEditor=null;
var newsDropzone=null;

var mapLat=0;
var mapLon=0;

//Used to display message when no search result is found
var noItems = $('<li id="no-items-found">No items found</li>');

$.fn.serializeObject = function()

{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml (string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

//----------------------------------CUSTOM FUNCTIONS---------------------------------------------------------------
function getExactDate(d){
    var date = new Date(d.replace("T"," ").replace(/-/g,"/"));
    var mdate=date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
    return mdate;
}
function getHtmlSettableDate(d){
    var date = new Date(d.replace("T"," ").replace(/-/g,"/"));
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);

    var today = date.getFullYear()+"-"+(month)+"-"+(day) 
    return today;
}
function getCount(){
    var js={};
//Getting video count
$.ajax({
     type:'POST',
     url:globalroot+"countVideos",
     contentType: "application/json",
     encode:true
 }).done(function(data){
        js.videoCount=data;
        $('#video_count').html(js.videoCount);
      }).fail(function(data){
          console.log(data);
    });

//Getting audio count
$.ajax({
     type:'POST',
     url:globalroot+"countAudios",
     contentType: "application/json",
     encode:true
 }).done(function(data){
        js.audioCount=data;
		$('#audio_count').html(js.audioCount);
      }).fail(function(data){
          console.log(data);
    });

//Getting news count
$.ajax({
     type:'POST',
     url:globalroot+"countLiveDarshan",
     contentType: "application/json",
     encode:true
 }).done(function(data){
        js.liveDarshanCount=data;
		$('#live_count').html(js.liveDarshanCount);
      }).fail(function(data){
          console.log(data);
    });
//Getting event count
$.ajax({
     type:'POST',
     url:globalroot+"countEvents",
     contentType: "application/json",
     encode:true
 }).done(function(data){
        js.eventCount=data;
		$('#event_count').html(js.eventCount);
      }).fail(function(data){
          console.log(data);
    });
//Getting news count
$.ajax({
     type:'POST',
     url:globalroot+"countNews",
     contentType: "application/json",
     encode:true
 }).done(function(data){
        js.newsCount=data;
		$('#news_count').html(js.newsCount);
      }).fail(function(data){
          console.log(data);
    });
//Getting message count
$.ajax({
     type:'POST',
     url:globalroot+"countMessages",
     contentType: "application/json",
     encode:true
 }).done(function(data){
       
        js.messageCount=data;
		$('#message_count').html(js.messageCount);
      }).fail(function(data){
          console.log(data);
    });

 
 
 
 return js;
}
//------------------------------------------VIDEO STARTS -----------------------------------------------------------
function addVideo(){
   console.log("add video called");
  sendobject=JSON.stringify($('#addVideoForm').serializeObject());
  console.log(sendobject);
  
 $.ajax({
     type:'POST',
     url:globalroot+"addVideo",
     contentType: "application/json",
     data:sendobject,
     headers: {
    'Authorization': 'Bearer ' + sessionStorage.token
  },
     encode:true
 }).done(function(data){
     console.log(data);
    $('#addVideoForm')[0].reset();
    $.snackbar({content:"Video added successfully!", timeout: 2000,id:"mysnack"});
    getVideos();
 }).fail(function(data){
     console.log(data);
      $.snackbar({content:"Video addition failed!", timeout: 2000,id:"mysnack"});
 });
    

 

}

function getVideos(){
     $.ajax({
            type        : 'POST', 
            url         : globalroot+'videos', 
            encode      : true,
            headers: {
            'Authorization': 'Bearer ' + sessionStorage.token
            }     
        })
            // using the done promise callback
        .done(function(data) {
            console.log("I received this ");
            console.log(data);
                var output=$('#video_table_body');
            // output.empty();
           console.log("clearing the data");
            $('#video_table').DataTable().clear().draw();

            data.forEach(function(video){
                    console.log(video);
                    var mdate=getExactDate(video.created);
                    $('#video_table').DataTable().row.add(
                            [
                        video.title,
                        mdate,
                            '<a target="_blank" href='+video.videoPath+'><i class="fa fa-external-link"></i></a>',
                            "<button class='btn btn-xs btn-danger' id='del-"+video._id+"' onclick='deleteVideo(this.id)'>Delete</button>          <button class='btn btn-xs btn-info' id='upd-"+video._id+"'onclick='updateVideo(this.id)'>Update</button>"
                        ] 
                        ).draw();
                        });
            
                // log data to the console so we can see
            });  
}
function changeVideoDetails(){
    sendobject=JSON.stringify($('#addVideoForm').serializeObject());
    console.log("chnaeg video details called");
    sobj=JSON.parse(sendobject);
    sobj.id=updateObjectId;
    send=JSON.stringify(sobj);
 
    console.log(send);
 $.ajax({
     type:'POST',
     url:globalroot+"updateVideo",
     contentType: "application/json",
     data:send,
     headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },encode:true
 }).done(function(data){
     console.log(data);
     $('#addVideoForm')[0].reset();
     $('#videoHeader').html("Add Video");
     $('#addVideoForm').unbind('submit');
     $('#addVideoForm').submit(function(e) {e.preventDefault();addVideo();});
     getVideos();
     
      $.snackbar({content:"Video added successfully!", timeout: 2000,id:"mysnack"});
       updateObjectId=null;
 }).fail(function(data){
     console.log(data);
      $.snackbar({content:"Video addition failed!", timeout: 2000,id:"mysnack"});
 });
    
  
}

function updateVideo(video){
  
    id=video.split("-")[1];
    
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'getVideoDetails', 
            data        :JSON.stringify({"id":id}),
            processData: false,
            contentType: 'application/json',
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $('#videoHeader').html("Editing "+data.title);
                $('#videotitle').val(data.title);
                $('#videodesc').val(data.desc);
                $('#videourl').val(data.videoPath);
                $('#addVideoForm').unbind('submit');
                updateObjectId=id;
                $('#addVideoForm').submit(function(e) {e.preventDefault();changeVideoDetails();});
             
                $.snackbar({content:"You can edit the video now!", timeout: 2000,id:"mysnack"});
                getVideos();
                
            })
            .fail(function(data){
        
                console.log(data);
            });
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}
function deleteVideo(video){
    id=video.split("-")[1];
    
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'removeVideo', 
            data        :JSON.stringify({"id":id}),
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            processData: false,
            contentType: 'application/json',
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $.snackbar({content:"Video deleted succesfully!", timeout: 2000,id:"mysnack"});
                getVideos();
            
                /*
                    
                */
                
            })
            .fail(function(data){
        
                console.log(data);
            });
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}
//------------------------------------------VIDEO ENDS  -----------------------------------------------------------

//------------------------------------------AUDIO STARTS -----------------------------------------------------------
function addAudio(){
  //Name is add audio
  //But is used only while updating audio,with no new file used
 
  sendobject=JSON.stringify($('#addAudioForm').serializeObject());
js=JSON.parse(sendobject);
js.id=updateId;
sendobject=JSON.stringify(js);
console.log(sendobject);

    $.ajax({
         type:'POST',
         url:globalroot+"updateAudio",
         contentType: "application/json",
         data:sendobject,
         headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
         encode:true
     }).done(function(data){
         console.log(data);
         $('#addAudioForm')[0].reset();
         
         getAudios();
            
        $.snackbar({content:"Audio update successfully!", timeout: 2000,id:"mysnack"});
     }).fail(function(data){
         console.log(data);
        $.snackbar({content:"Updation of audio failed!", timeout: 2000,id:"mysnack"});
     });
  

  

 

}
var audioDropzone=null;
var updateMode=false;
var updateId=null;
var updateAudioFileName="Filename";
var updateAudioPath=null;
function setUpdateMode(bool){
    updateMode=bool;
    $('#audioHeader').html('Add audio');
}
function getUpdateInfo(){
    js={};
    js.updateMode=updateMode;
    js.updateId=updateId;
    return js;
}
function setAudioDropzone(){
    var rawElement = $("div#my-dropzone").get(0);
    audioDropzone=rawElement.dropzone;
}

function updateDropzoneParams(){
    audioDropzone.options.url=globalroot+"updateAudio?id="+updateId;

}

function getAudios(){
     $.ajax({
            type        : 'POST', 
            url         : globalroot+'audios', 
            encode      : true,
             headers: {     'Authorization': 'Bearer ' + sessionStorage.token   }
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                console.log("This is the data received");
                $.Mustache.load('templates/audio.htm')
					.fail(function () { 
						console.log('Failed to load templates from <code>templates.htm</code>');
					})
					.done(function () {
                        var output=$('#audio-box');
                        $('#audio_table').DataTable().clear().draw();
                        //output.empty();

                        data.forEach(function(audio){
                            console.log(audio);
                            console.log("i was in");
                             var mdate=getExactDate(audio.created);
                            $('#audio_table').DataTable().row.add( [
                            audio.title,
                            mdate,
                            '<audio controls><source src='+globalroot+audio.audioPath+'></audio>',
                           
                            "<button class='btn btn-xs btn-danger' id='del-"+audio._id+"' onclick='deleteAudio(this.id)'>Delete</button>          <button class='btn btn-xs btn-info' id='upd-"+audio._id+"'onclick='updateAudio(this.id)'>Update</button>"
                                ] ).draw();
                            // output.mustache('audio-template', { id:audio._id,title: audio.title,date:mdate,url:globalroot+audio.audioPath });
                         });
                       
                    });
               
                // here we will handle errors and validation messages
            })
            .fail(function(data){
        
                console.log(data);
            });
}
function updateAudio(audio){
    id=audio.split("-")[1];
   
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'getAudioDetails', 
            data        :JSON.stringify({"id":id}),
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            processData: false,
            contentType: 'application/json',
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $('#audioHeader').html("Editing "+data.title);
                $('#audiotitle').val(data.title);
                $('#audiodesc').val(data.desc);
                setUpdateMode(true);
                updateId=id;
                updateAudioPath=data.audioPath;
                updateDropzoneParams();
                $.Mustache.load('templates/audio.htm')
                .fail(function () { 
                    console.log('Failed to load templates from <code>templates.htm</code>');
                })
                .done(function () {
                    var output=$('#existingAudio');
                    output.empty();
                    output.mustache('existing-audio-template', {filename:data.audioPath,url:globalroot+updateAudioPath});
                           
                    getAudios();
                });

                 $.snackbar({content:"You can edit the audio details now!The audio file is set to previous file", timeout: 2000,id:"mysnack"});
            })
            .fail(function(data){
        
                console.log(data);
            });
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}
function deleteAudio(audio){
    id=audio.split("-")[1];
    
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'removeAudio', 
            data        :JSON.stringify({"id":id}),
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            processData: false,
            contentType: 'application/json',
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                
                $.snackbar({content:"Audio deleted succesfully!", timeout: 2000,id:"mysnack"});
                getAudios();
            })
            .fail(function(data){
                $.snackbar({content:"Audio deletion failed!", timeout: 2000,id:"mysnack"});
                console.log(data);
            });
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}

//------------------------------------------AUDIO ENDS-----------------------------------------------------------

//------------------------------------------MESSAGE STARTS -----------------------------------------------------------
function addMessage(){
  
  sendobject=JSON.stringify($('#addMessageForm').serializeObject());
  console.log(sendobject);
    
    $.ajax({
         type:'POST',
         url:globalroot+updateMessageEndPoint,
         headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
         contentType: "application/json",
         data:sendobject,
         encode:true
     }).done(function(data){
         console.log(data);
         $('#addMessageForm')[0].reset();
         getMessages();
        $.snackbar({content:"Message added successfully!", timeout: 2000,id:"mysnack"});
     }).fail(function(data){
         console.log(data);
        $.snackbar({content:"Addition of message failed!", timeout: 2000,id:"mysnack"});
     });
     setMessageUpdateMode(false);
  

 

}
var messageDropzone=null;
var updateMessageMode=false;
var updateMessageId=null;
var updateMessageFileName="Filename";
var updateMessagePath=null;
var updateMessageEndPoint="writemessage";
function setMessageUpdateMode(bool){
    updateMessageMode=bool;
    if(!bool){
    $('#messageHeader').html('Add message of the day');
    updateMessageEndPoint="writemessage";
    $("#existingMessage").html('');
    }
}
function getMessageUpdateInfo(){
    js={};
    js.updateMessageMode=updateMessageMode;
    js.updateMessageId=updateMessageId;
    return js;
}
function setMessageDropzone(){
    var rawElement = $("div#message-dropzone").get(0);
    messageDropzone=rawElement.dropzone;
}

function updateMessageParams(){
    messageDropzone.options.url=globalroot+"updateMessage?id="+updateMessageId;
    updateMessageEndPoint="updateMessage?id="+updateMessageId;
}
function getMessages(){
     $.ajax({
            type        : 'POST', 
            url         : globalroot+'/message1', 
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $.Mustache.load('templates/message.htm')
					.fail(function () { 
						console.log('Failed to load templates from <code>templates.htm</code>');
					})
					.done(function () {
                        var output=$('#message-box');
                       
                        output.empty();
                        data.forEach(function(message){
                            console.log(message);
                            var date = new Date(
                                message.date
                                .replace("T"," ")
                                .replace(/-/g,"/")
                            );
                             var mdate=date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
                             
                            if(message.imagePath!=""){
                                output.mustache('message-img-template', {id:message._id,date:mdate,thought:message.message,url:globalroot+message.imagePath});
                            }
                           else{
                               console.log("outputing without image")
                               output.mustache('message-template', {id:message._id,date:mdate,thought:message.message});
                           }
                            
                             
                         });
                    var options={
                            valueNames: [
                            'date',
                            'message',
                            ],
                            page: 3,
                            pagination: true
                        };
                     messageList=new List('messageList',options);
                     messageList.on('updated', function(list) {
                        if (list.matchingItems.length == 0) {
                            $(list.list).append(noItems);
                        } else {
                            noItems.detach();
                        }
                     });
                    });
               
                // here we will handle errors and validation messages
            })
            .fail(function(data){
        
                console.log(data);
            });
}
function deleteMessage(message){
    id=message.split("-")[1];
    
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'removeMessage', 
            data        :JSON.stringify({"id":id}),
            processData: false,
            contentType: 'application/json',
             headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $.snackbar({content:"Message deleted succesfully!", timeout: 2000,id:"mysnack"});
            
                getMessages();
                /*
                    
                */
                
            })
            .fail(function(data){
                $.snackbar({content:"Message deletion failed!", timeout: 2000,id:"mysnack"});
                console.log(data);
            });
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}
function setMessageList(list){
    messageList=list;
}
function updateMessage(message){
    id=message.split("-")[1];
   
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'getMessageDetails', 
            data        :JSON.stringify({"id":id}),
             headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            processData: false,
            contentType: 'application/json',
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
               
                setMessageUpdateMode(true);
                $('#messageHeader').html("Editing message for "+getExactDate(data.date));
                $('#messageText').val(data.message);
                $('#messageDate').val(getHtmlSettableDate(data.date));
                updateMessageId=id;
                updateMessagePath=data.imagePath;
                updateMessageParams();
                $.Mustache.load('templates/message.htm')
                .fail(function () { 
                    console.log('Failed to load templates from <code>templates.htm</code>');
                })
                .done(function () {
                    var output=$('#existingMessage');
                    output.empty();
                    if(data.imagePath=="")
                    output.mustache('existing-message-template', {filename:"No file associated",url:globalroot+data.imagePath});
                    else
                    output.mustache('existing-image-message-template', {filename:data.messagePath,url:globalroot+data.imagePath});
                });

                 $.snackbar({content:"You can edit the message details now!The message file is set to previous file", timeout: 2000,id:"mysnack"});
            })
            .fail(function(data){
        
                console.log(data);
            });
    
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}
//------------------------------------------MESSAGE ENDS-----------------------------------------------------------

//------------------------------------------Live Darshan STARTS -----------------------------------------------------------
function addLiveVideo(){
 
  sendobject=JSON.stringify($('#addLiveVideoForm').serializeObject());
  console.log(sendobject);
 
 $.ajax({
     type:'POST',
     url:globalroot+"addLiveDarshan",
     contentType: "application/json",
      headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
     data:sendobject,
     encode:true
 }).done(function(data){
     console.log(data);
     $('#addLiveVideoForm')[0].reset();
      $.snackbar({content:"Live stream added successfully!", timeout: 2000,id:"mysnack"});
 }).fail(function(data){
     console.log(data);
 });
    
  getLiveVideos();

 

}

function getLiveVideos(){
     $.ajax({
            type        : 'POST', 
            url         : globalroot+'liveDarshan',
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   }, 
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $.Mustache.load('templates/live-video.htm')
					.fail(function () { 
						console.log('Failed to load templates from <code>templates.htm</code>');
					})
					.done(function () {
                        var output=$('#live-video-box');
                        
                        output.empty();
                       
                        data.forEach(function(video){
                             var mdate=getExactDate(video.date);
                             output.mustache('live-video-template', {id:video._id, title: video.title,date:mdate,url:video.videoPath,desc:video.desc,venue:video.venue,time:video.time});
                             
                        });
                       var options={
                            valueNames: [
                            'title',
                            'date',
                            'venue',
                            { attr: 'id', name : 'id' }
                            ],
                            item:'live-video-item',
                            page:2,
                            pagination:true
                        };
                    var liveList=new List('live_darshan',options);
                    liveList.on('updated', function(list) {
                        if (list.matchingItems.length == 0) {
                            $(list.list).append(noItems);
                        } else {
                            noItems.detach();
                        }
                     });
                
                    setLiveVideoList(liveList);
                    });
               
                // here we will handle errors and validation messages
            })
            .fail(function(data){
        
                console.log(data);
            });
}

function deleteLiveVideo(video){
    id=video.split("-")[1];
   //id=video;
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'removeLiveDarshan', 
            data        :JSON.stringify({"id":id}),
            processData: false,
            contentType: 'application/json',
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $.snackbar({content:"Live video deleted succesfully!", timeout: 2000,id:"mysnack"});
            
                /*
                    
                */
                
            })
            .fail(function(data){
                $.snackbar({content:"Live video deletion failed!", timeout: 2000,id:"mysnack"});
                console.log(data);
            });
    getLiveVideos();
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}

function setLiveVideoList(list){
    liveVideoList=list;
}
function changeLiveVideoDetails(){
    sendobject=JSON.stringify($('#addLiveVideoForm').serializeObject());
    console.log("chnaeg live video details called");
    sobj=JSON.parse(sendobject);
    sobj.id=updateObjectId;
    send=JSON.stringify(sobj);
 
    console.log(send);
 $.ajax({
     type:'POST',
     url:globalroot+"updateLiveDarshan",
     headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
     contentType: "application/json",
     data:send,
     encode:true
 }).done(function(data){
     console.log(data);
     $('#addLiveVideoForm')[0].reset();
     $('#liveVideoHeader').html("Add Live Darshan Stream");
     $('#addLiveVideoForm').unbind('submit');
     $('#addLiveVideoForm').submit(function(e) {e.preventDefault();addLiveVideo();});
     getLiveVideos();
     $.snackbar({content:"Live stream updated successfully!", timeout: 2000,id:"mysnack"});
     updateObjectId=null;
 }).fail(function(data){
     console.log(data);
     $.snackbar({content:"Live stream updation failed!", timeout: 2000,id:"mysnack"});
 });
    
  
}
function updateLiveVideo(video){
    id=video.split("-")[1];
    
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'getLiveDarshanDetails', 
            data        :JSON.stringify({"id":id}),
            processData: false,
            contentType: 'application/json',
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $('#liveVideoHeader').html("Editing "+data.title);
                $('#liveVideoTitle').val(data.title);
                $('#liveVideoDesc').val(data.desc);
                $('#liveVideoVenue').val(data.venue);
                $('#liveVideoDate').val(getHtmlSettableDate(data.date));
                $('#liveVideoPath').val(data.videoPath);
                $('#addLiveVideoForm').unbind('submit');
                updateObjectId=id;
                $('#addLiveVideoForm').submit(function(e) {e.preventDefault();changeLiveVideoDetails();});
             
                $.snackbar({content:"You can edit the video now!", timeout: 2000,id:"mysnack"});
                
            })
            .fail(function(data){
        
                console.log(data);
            });
    getLiveVideos();
}

//------------------------------------------LIVE DARSHAN  ENDS  -----------------------------------------------------------
//------------------------------------------NEWS STARTS -----------------------------------------------------------
function addNews(){
    sendobject=JSON.stringify($('#addNewsForm').serializeObject());
    console.log(sendobject);
    console.log("sending via main.js");
    $.ajax({
         type:'POST',
         url:globalroot+updateNewsEndPoint,
         headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
         contentType: "application/json",
         data:sendobject,
         encode:true
     }).done(function(data){
         console.log(data);
         $('#addNewsForm')[0].reset();
         getNews();
        $.snackbar({content:"News added successfully!", timeout: 2000,id:"mysnack"});
     }).fail(function(data){
         console.log(data);
        $.snackbar({content:"Addition of News failed!", timeout: 2000,id:"mysnack"});
     });
     setNewsUpdateMode(false);


}
var updateNewsMode=false;
var updateNewsId=null;
var updateNewsFileName="Filename";
var updateNewsPath=null;
var updateNewsEndPoint="writeNews";

function setNewsUpdateMode(bool){
    updateNewsMode=bool;
    if(!bool){
    $('#newsHeader').html('Add News of the day');
    updateNewsEndPoint="addNews";
    $("#existingNews").html('');
    }
}
function getNewsUpdateInfo(){
    js={};
    js.updateNewsMode=updateNewsMode;
    js.updateNewsId=updateNewsId;
    return js;
}


function updateNewsParams(){
    newsDropzone.options.url=globalroot+"updateNews?id="+updateNewsId;
    updateNewsEndPoint="updateNews?id="+updateNewsId;
}
function updateNews(news){
    id=news.split("-")[1];
   
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'getNewsDetails', 
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            data        :JSON.stringify({"id":id}),
            processData: false,
            contentType: 'application/json',
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
               
                setNewsUpdateMode(true);
                $('#newsHeader').html("Editing News for "+getExactDate(data.date));
                $('#news-title').val(data.title);
                $('#newsDate').val(getHtmlSettableDate(data.date));
                $('iframe').contents().find('.wysihtml5-editor').html(data.desc);
               
                updateNewsId=id;
                updateNewsPath=data.imagePath;
                updateNewsParams();
                $.Mustache.load('templates/news.htm')
                .fail(function () { 
                    console.log('Failed to load templates from <code>news.htm</code>');
                })
                .done(function () {
                    var output=$('#existingNews');
                    output.empty();
                    if(data.imagePath=="")
                    output.mustache('existing-news-template', {filename:"No file associated",url:globalroot+data.imagePath});
                    else
                    output.mustache('existing-image-news-template', {filename:data.imagePath,url:globalroot+data.imagePath});
             
               });

                 $.snackbar({content:"You can edit the news details now!The News file is set to previous file", timeout: 2000,id:"mysnack"});
            })
            .fail(function(data){
        
                console.log(data);
            });
    
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}
function getNews(){
     $.ajax({
            type        : 'POST', 
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            url         : globalroot+'news', 
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $.Mustache.load('templates/news.htm')
					.fail(function () { 
						console.log('Failed to load templates from <code>templates.htm</code>');
					})
					.done(function () {
                        var output=$('#news-box');
                       
                        output.empty();
                        data.forEach(function(news){
                            console.log(news);
                            var date = new Date(
                                news.date
                                .replace("T"," ")
                                .replace(/-/g,"/")
                            );
                             var mdate=date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
                             
                            
                           if(news.imagePath!=""){
                               output.mustache('latest-news-img-template', {id:news._id,title:news.title,content:news.desc,date:mdate,url:globalroot+news.imagePath});
                           }
                           else{
                               console.log("outputing without image")
                                 output.mustache('latest-news-template', {id:news._id,title:news.title,content:news.desc,date:mdate});
                            }
                            
                          
                             
                         });
                        var options={
                        valueNames: [
                        'date',
                        'title',
                        ],
                        page: 3,
                        pagination: true
                        };
                     messageList=new List('newsList',options);
                    messageList.on('updated', function(list) {
                        if (list.matchingItems.length == 0) {
                            $(list.list).append(noItems);
                        } else {
                            noItems.detach();
                        }
                     }); 
                    });
               
                // here we will handle errors and validation messages
            })
            .fail(function(data){
        
                console.log(data);
            });
}

function deleteNews(news){
    id=news.split("-")[1];
    
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'removeNews', 
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            data        :JSON.stringify({"id":id}),
            processData: false,
            contentType: 'application/json',
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $.snackbar({content:"News deleted succesfully!", timeout: 2000,id:"mysnack"});
                getNews();
            
                /*
                    
                */
                
            })
            .fail(function(data){
                $.snackbar({content:"News deletion failed!", timeout: 2000,id:"mysnack"});
                console.log(data);
            });
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}


//------------------------------------------NEWS ENDS-----------------------------------------------------------

//------------------------------------------EVENTS STARTS-----------------------------------------------------------

function addEvent(){
   console.log("add Event called");
  sendobject=JSON.stringify($('#addEventForm').serializeObject());
  console.log(sendobject);
 
 $.ajax({
     type:'POST',
     url:globalroot+"addEvent",
     contentType: "application/json",
     headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
     data:sendobject,
     encode:true
 }).done(function(data){
     console.log(data);
     $('#addEventForm')[0].reset();
      $.snackbar({content:"Event added successfully!", timeout: 2000,id:"mysnack"});
    getEvents();
 }).fail(function(data){
     console.log(data);
      $.snackbar({content:"Event addition failed!", timeout: 2000,id:"mysnack"});
 });
    
}

function getEvents(){ 
     $.ajax({
            type        : 'POST', 
            url         : globalroot+'events', 
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {
                     console.log(data);
              
                $.Mustache.load('templates/event.htm')
					.fail(function () { 
						console.log('Failed to load templates from <code>event.htm</code>');
					})
					.done(function () {
                        var output=$('#event_table_body');
                        $('#event_table').DataTable().destroy().draw();
                        output.empty();
                        even=true;
                        data.forEach(function(event){
                            console.log(event);
                            var date = new Date(
                                event.date
                                .replace("T"," ")
                                .replace(/-/g,"/")
                            );
                             var mdate=date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
                           
                        if(even){
                            output.mustache('event-template-even', {id:event._id,name:event.name,title:event.title,date:mdate,description:event.desc,venue:event.venue});
                            even=false;
                        }   
                        else{
                            output.mustache('event-template-odd',{id:event._id,name:event.name,title:event.title,date:mdate,description:event.desc,venue:event.venue});
                            even=true;
                            
                        }
                       });
                         $('#event_table').DataTable().draw();
                     
                          
                             
                         })                    
        .fail(function(data){
                console.log("failed.....");
                console.log(data);
            });
});
}

function deleteEvent(event){
    id=event.split("-")[1];
    
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'removeEvent', 
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            data        :JSON.stringify({"id":id}),
            processData: false,
            contentType: 'application/json',
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $.snackbar({content:"Events deleted succesfully!", timeout: 2000,id:"mysnack"});
            
                /*
                    
                */
                getEvents();
                
            })
            .fail(function(data){
                $.snackbar({content:"Events deletion failed!", timeout: 2000,id:"mysnack"});
                console.log(data);
            });
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}

function changeEventDetails(){
    sendobject=JSON.stringify($('#addEventForm').serializeObject());
    sobj=JSON.parse(sendobject);
    sobj.id=updateObjectId;
    send=JSON.stringify(sobj);
 
    console.log(send);
 $.ajax({
     type:'POST',
     headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
     url:globalroot+"updateEvent",
     contentType: "application/json",
     data:send,
     encode:true
 }).done(function(data){
     console.log(data);
     $('#addEventForm')[0].reset();
     $('#event-header').html("Add Event");
     $('iframe').contents().find('.wysihtml5-editor').html();
                
     $('#addEventForm').unbind('submit');
     $('#addEventForm').submit(function(e) {e.preventDefault();addEvent();});
     getEvents();
     
      $.snackbar({content:"Event added successfully!", timeout: 2000,id:"mysnack"});
       updateObjectId=null;
 }).fail(function(data){
     console.log(data);
      $.snackbar({content:"Event addition failed!", timeout: 2000,id:"mysnack"});
 });
    
  
}

function updateEvent(event){
     id=event.split("-")[1];
    
    $.ajax({
            type        : 'POST', 
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            url         : globalroot+'getEventDetails', 
            data        :JSON.stringify({"id":id}),
            processData: false,
            contentType: 'application/json',
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                               
                $('#event-header').html("Editing "+data.title);
                $('#event-name').val(data.title);
                $('#event-title').val(data.title);
                $('#event-date').val(getHtmlSettableDate(data.created));
                $('#event-venue').val(data.venue);
                $('iframe').contents().find('.wysihtml5-editor').html(data.desc);
                $('#addEventForm').unbind('submit');
                updateObjectId=id;
                $('#addEventForm').submit(function(e) {e.preventDefault();changeEventDetails();});
                $.snackbar({content:"You can edit the event now!", timeout: 2000,id:"mysnack"});
            
                
            })
            .fail(function(data){
        
                console.log(data);
            });
}
//------------------------------------------EVENTS ENDS-----------------------------------------------------------
//------------------------------------------article STARTS -----------------------------------------------------------
function addArticle(){
    sendobject=JSON.stringify($('#addArticleForm').serializeObject());
    console.log(sendobject);
    console.log("sending via main.js");
    $.ajax({
         type:'POST',
         url:globalroot+updateArticleEndPoint,
         headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
         contentType: "application/json",
         data:sendobject,
         encode:true
     }).done(function(data){
         console.log(data);
         $('#addArticleForm')[0].reset();
         getArticle();
        $.snackbar({content:"Article added successfully!", timeout: 2000,id:"mysnack"});
     }).fail(function(data){
         console.log(data);
        $.snackbar({content:"Addition of article failed!", timeout: 2000,id:"mysnack"});
     });
     setArticleUpdateMode(false);
  

}
var updateArticleMode=false;
var updateArticleId=null;
var updateArticleFileName="Filename";
var updateArticlePath=null;
var updateArticleEndPoint="addArticle";

function setArticleUpdateMode(bool){
    updateArticleMode=bool;
    if(!bool){
    $('#articleHeader').html('Add article of the day');
    updateArticleEndPoint="addArticle";
    $("#existingArticle").html('');
    }
}
function getArticleUpdateInfo(){
    js={};
    js.updateArticleMode=updateArticleMode;
    js.updateArticleId=updateArticleId;
    return js;
}


function updateArticleParams(){
    articleDropzone.options.url=globalroot+"updateArticle?id="+updateArticleId;
    updateArticleEndPoint="updateArticle?id="+updateArticleId;
}
function updateArticle(article){
    id=article.split("-")[1];
   
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'getArticleDetails', 
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            data        :JSON.stringify({"id":id}),
            processData: false,
            contentType: 'application/json',
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
               
                setArticleUpdateMode(true);
                $('#articleHeader').html("Editing article for "+getExactDate(data.created));
                $('#article-title').val(data.title);
                $('iframe').contents().find('.wysihtml5-editor').html(data.desc);
               
                updateArticleId=id;
                updateArticlePath=data.imagePath;
                updateArticleParams();
                $.Mustache.load('templates/articles.htm')
                .fail(function () { 
                    console.log('Failed to load templates from <code>articles.htm</code>');
                })
                .done(function () {
                    var output=$('#existingArticle');
                    output.empty();
                    if(data.imagePath=="")
                    output.mustache('existing-article-template', {filename:"No file associated",url:globalroot+data.imagePath});
                    else
                    output.mustache('existing-article-img-template', {filename:data.imagePath,url:globalroot+data.imagePath});
             
               });

                 $.snackbar({content:"You can edit the article details now!The article file is set to previous file", timeout: 2000,id:"mysnack"});
            })
            .fail(function(data){
        
                console.log(data);
            });
    
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}
function getArticle(){
     $.ajax({
            type        : 'POST', 
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            url         : globalroot+'articles', 
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $.Mustache.load('templates/articles.htm')
					.fail(function () { 
						console.log('Failed to load templates from <code>templates.htm</code>');
					})
					.done(function () {
                        var output=$('#article-box');
                       
                        output.empty();
                        data.forEach(function(article){
                            console.log(article);
                            var date = new Date(
                                article.created
                                .replace("T"," ")
                                .replace(/-/g,"/")
                            );
                             var mdate=date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
                             
                            
                           if(article.imagePath!=""){
                               output.mustache('article-img-template', {id:article._id,title:article.title,content:article.desc,date:mdate,url:globalroot+article.imagePath});
                           }
                           else{
                               console.log("outputing without image")
                                 output.mustache('article-template', {id:article._id,title:article.title,content:article.desc,date:mdate});
                            }
                            
                          
                             
                         });
                        var options={
                        valueNames: [
                        'date',
                        'title',
                        ],
                        page: 3,
                        pagination: true
                        };
                     articleList=new List('articleList',options);
                     articleList.on('updated', function(list) {
                        if (list.matchingItems.length == 0) {
                            $(list.list).append(noItems);
                        } else {
                            noItems.detach();
                        }
                     });
                    });
               
                // here we will handle errors and validation messages
            })
            .fail(function(data){
        
                console.log(data);
            });
}

function deleteArticle(article){
    id=article.split("-")[1];
    
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'removeArticle', 
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            data        :JSON.stringify({"id":id}),
            processData: false,
            contentType: 'application/json',
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $.snackbar({content:"Article deleted succesfully!", timeout: 2000,id:"mysnack"});
            
                /*
                    
                */
                
                getArticle();
            })
            .fail(function(data){
                $.snackbar({content:"Article deletion failed!", timeout: 2000,id:"mysnack"});
                console.log(data);
            });
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}


//------------------------------------------article ENDS-----------------------------------------------------------


//------------------------------------------Centre LOCATOR STARTS-----------------------------------------------------------
function addCentre(){
   console.log("add Centre called");
  sendobject=JSON.stringify($('#addCentreForm').serializeObject());
  console.log(sendobject);
 js=JSON.parse(sendobject);
  js.latitude=mapLat;
  js.longitude=mapLon;
  sendobject=JSON.stringify(js);
 $.ajax({
     type:'POST',
     url:globalroot+"addCentre",
     headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
     contentType: "application/json",
     data:sendobject,
     encode:true
 }).done(function(data){
     console.log(data);
     $('#addCentreForm')[0].reset();
      $.snackbar({content:"Centre added successfully!", timeout: 2000,id:"mysnack"});
 }).fail(function(data){
     console.log(data);
      $.snackbar({content:"Centre addition failed!", timeout: 2000,id:"mysnack"});
 });
    
  getCentres();

 

}

function getCentres(){
     $.ajax({
            type        : 'POST', 
            headers: {     'Authorization': 'Bearer ' + sessionStorage.token   },
            url         : globalroot+'centres', 
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $.Mustache.load('templates/Centre.htm')
					.fail(function () { 
						console.log('Failed to load templates from <code>templates.htm</code>');
					})
					.done(function () {
                        console.log(data);
                        var output=$("#center-box");
                        output.empty();
                        data.forEach(function(centre){
                            output.mustache('centre-template', {id:centre._id,address:centre.address,city:centre.city,state:centre.state,country:centre.country,pin:centre.pin});
                        });
                         var options={
                            valueNames: [
                            'state',
                            'address',
                            'city',
                            'country',
                            'pin',
                            ],
                            page: 3,
                            pagination: true
                        };
                     centreList=new List('centreList',options);
                       
                    })

               
                // here we will handle errors and validation messages
            
            })
            .fail(function(data){
        
                console.log(data);
            });
    
        
}
//------------------------------------------Centre LOCATOR ENDS-----------------------------------------------------------