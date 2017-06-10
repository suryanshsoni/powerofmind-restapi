
var root="http://localhost:3000/";
var globalroot="http://localhost:3000/";

//var used to store the id of currently updating object
var updateObjectId=null;

var liveVideoList=null;

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
     encode:true
 }).done(function(data){
     console.log(data);
     $('#addVideoForm')[0].reset();
      $.snackbar({content:"Video added successfully!", timeout: 2000,id:"mysnack"});
 }).fail(function(data){
     console.log(data);
      $.snackbar({content:"Video addition failed!", timeout: 2000,id:"mysnack"});
 });
    
  getVideos();

 

}

function getVideos(){
     $.ajax({
            type        : 'POST', 
            url         : globalroot+'videos', 
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $.Mustache.load('templates/video.htm')
					.fail(function () { 
						console.log('Failed to load templates from <code>templates.htm</code>');
					})
					.done(function () {
                       // var output=$('#video-box');
                       
                        var output=$('#video_table_body');
                        output.empty();
                        $('#video_table').DataTable().clear();
                        data.forEach(function(video){
                             console.log(video);
                             var mdate=getExactDate(video.created);
                                $('#video_table').dataTable().fnAddData( [
                                video.title,
                                mdate,
                                '<a target="_blank" href='+video.videoPath+'><i class="fa fa-external-link"></i></a>',
                                "<button class='btn btn-xs btn-danger' id='del-"+video._id+"' onclick='deleteVideo(this.id)'>Delete</button>          <button class='btn btn-xs btn-info' id='upd-"+video._id+"'onclick='updateVideo(this.id)'>Update</button>"
                                 ] );
	
	
                             //var vidurl="https://www.youtube.com/embed/"+video.videoPath.split("=").pop();
                               // console.log(vidurl);
                             //output.mustache('video-template', {id:video._id, title: video.title,date:mdate,url:video.videoPath,desc:video.desc });
                         });
                       
                         
                    });
               
                // here we will handle errors and validation messages
            })
            .fail(function(data){
        
                console.log(data);
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
     encode:true
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
                
            })
            .fail(function(data){
        
                console.log(data);
            });
    getVideos();
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}
function deleteVideo(video){
    id=video.split("-")[1];
    
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'removeVideo', 
            data        :JSON.stringify({"id":id}),
            processData: false,
            contentType: 'application/json',
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $.snackbar({content:"Video deleted succesfully!", timeout: 2000,id:"mysnack"});
            
                /*
                    
                */
                
            })
            .fail(function(data){
        
                console.log(data);
            });
    getVideos();
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}
//------------------------------------------VIDEO ENDS  -----------------------------------------------------------

//------------------------------------------AUDIO STARTS -----------------------------------------------------------
function addAudio(){
  //Name is add audio
  //But is used only while updating audio,with no new file used
  //Good luck!
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
         encode:true
     }).done(function(data){
         console.log(data);
         $('#addAudioForm')[0].reset();
         getMessages();
         getAudios();
            
        $.snackbar({content:"Audio update successfully!", timeout: 2000,id:"mysnack"});
     }).fail(function(data){
         console.log(data);
        $.snackbar({content:"Updation of audio failed!", timeout: 2000,id:"mysnack"});
     });
  

  getAudios();

 

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
            encode      : true
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
                        $('#audio_table').DataTable().clear();
                        output.empty();
                        data.forEach(function(audio){
                            console.log(audio);
                            console.log("i was in");
                             var mdate=getExactDate(audio.created);
                            $('#audio_table').dataTable().fnAddData( [
                            audio.title,
                            mdate,
                            '<audio controls><source src='+globalroot+audio.audioPath+'></audio>',
                           
                            "<button class='btn btn-xs btn-danger' id='del-"+audio._id+"' onclick='deleteAudio(this.id)'>Delete</button>          <button class='btn btn-xs btn-info' id='upd-"+audio._id+"'onclick='updateAudio(this.id)'>Update</button>"
                                ] );
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
                           
                });

                 $.snackbar({content:"You can edit the audio details now!The audio file is set to previous file", timeout: 2000,id:"mysnack"});
            })
            .fail(function(data){
        
                console.log(data);
            });
    getAudios();
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}
function deleteAudio(audio){
    id=audio.split("-")[1];
    
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'removeAudio', 
            data        :JSON.stringify({"id":id}),
            processData: false,
            contentType: 'application/json',
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                
                $.snackbar({content:"Audio deleted succesfully!", timeout: 2000,id:"mysnack"});
            
                /*
                    
                */
                
            })
            .fail(function(data){
                $.snackbar({content:"Audio deletion failed!", timeout: 2000,id:"mysnack"});
                console.log(data);
            });
     $('#audio_table').DataTable().destroy();
    getAudios();
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}

//------------------------------------------AUDIO ENDS-----------------------------------------------------------

//------------------------------------------MESSAGE STARTS -----------------------------------------------------------
function addMessage(){
  
  sendobject=JSON.stringify($('#addMessageForm').serializeObject());
  console.log(sendobject);
    
    $.ajax({
         type:'POST',
         url:globalroot+"writemessage",
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
  getMessages();

 

}

function getMessages(){
     $.ajax({
            type        : 'POST', 
            url         : globalroot+'/message1', 
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
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);
                $.snackbar({content:"Message deleted succesfully!", timeout: 2000,id:"mysnack"});
            
                /*
                    
                */
                
            })
            .fail(function(data){
                $.snackbar({content:"Message deletion failed!", timeout: 2000,id:"mysnack"});
                console.log(data);
            });
    getMessages();
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
                        liveVideoList.clear();
                        data.forEach(function(video){
                            var mdate=getExactDate(video.created);
                             
                            liveVideoList.add({
                                title:video.title,
                                date:mdate,
                                id:video._id
                            });
                            /* OLD MUSTACHE WAY
                             var mdate=getExactDate(video.created);
                             output.mustache('live-video-template', {id:video._id, title: video.title,date:mdate,url:video.videoPath,desc:video.desc });
                             */
                        });
                       
                    });
               
                // here we will handle errors and validation messages
            })
            .fail(function(data){
        
                console.log(data);
            });
}

function deleteLiveVideo(video){
   // id=video.split("-")[1];
   id=video;
    $.ajax({
            type        : 'POST', 
            url         : globalroot+'removeLiveDarshan', 
            data        :JSON.stringify({"id":id}),
            processData: false,
            contentType: 'application/json',
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

//------------------------------------------LIVE DARSHAN  ENDS  -----------------------------------------------------------
//------------------------------------------NEWS STARTS -----------------------------------------------------------
function addNews(){
  
    title=$("#news-title").val();
    content=$("#news-editor").val();
   
   
    sendob=JSON.stringify({'title':title,'desc':content});
 
    $.ajax({
         type:'POST',
         url:globalroot+"addNews",
         contentType: "application/json",
         data:sendob,
         encode:true
     }).done(function(data){
         console.log(data);
         $('#addNewsForm')[0].reset();
        getNews();
        $.snackbar({content:"News added successfully!", timeout: 2000,id:"mysnack"});
     }).fail(function(data){
         console.log(data);
        $.snackbar({content:"Addition of  news failed!", timeout: 2000,id:"mysnack"});
     });
  

 

}

function getNews(){
     $.ajax({
            type        : 'POST', 
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
                        var output=$('#latest-news');
                       
                        output.empty();
                        data.forEach(function(news){
                            console.log(news);
                            var date = new Date(
                                news.created
                                .replace("T"," ")
                                .replace(/-/g,"/")
                            );
                             var mdate=date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
                             
                            
                                output.mustache('latest-news-template', {id:news._id,title:news.title,content:news.desc,date:mdate});
                           
                          
                             
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
            
                /*
                    
                */
                
            })
            .fail(function(data){
                $.snackbar({content:"News deletion failed!", timeout: 2000,id:"mysnack"});
                console.log(data);
            });
    getNews();
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}


//------------------------------------------NEWS ENDS-----------------------------------------------------------

//------------------------------------------EVENTS STARTS-----------------------------------------------------------
function getEvents(){ 
     $.ajax({
            type        : 'POST', 
            url         : globalroot+'events', 
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

                        output.empty();
                        even=true;
                        data.forEach(function(event){
                            console.log(event);
                            var date = new Date(
                                event.created
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
              
                      $('#event_table').DataTable();
                          
                             
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
                
            })
            .fail(function(data){
                $.snackbar({content:"Events deletion failed!", timeout: 2000,id:"mysnack"});
                console.log(data);
            });
    getEvents();
   // $.snackbar({content:"Video deleted successfully!", timeout: 2000,id:"mysnack"});
}

function updateEvent(event){
     id=event.split("-")[1];
    
    $.ajax({
            type        : 'POST', 
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
                var date = new Date(
                                data.created
                                .replace("T"," ")
                                .replace(/-/g,"/")
                            );
                var mdate=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                               
                $('#event-header').html("Editing "+data.title);
                $('#event-name').val(data.title);
                $('#event-title').val(data.title);
                $('#event-date').val(mdate);
                $('#event-venue').val(data.venue);
                $('#event-editor').val(data.desc);
                $('#addEventForm').unbind('submit');
                updateObjectId=id;
                $('#addEventForm').submit(function(e) {e.preventDefault();changeEventDetails();});
             
                $.snackbar({content:"You can edit the event now!", timeout: 2000,id:"mysnack"});
                
            })
            .fail(function(data){
        
                console.log(data);
            });
    getVideos();
}
//------------------------------------------EVENTS ENDS-----------------------------------------------------------
