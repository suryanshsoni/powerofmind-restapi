var root="http://192.168.1.3:3000/";
var globalroot="http://localhost:3000/";
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
//------------------------------------------VIDEO STARTS -----------------------------------------------------------
function addVideo(){
 
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
                        var output=$('#video-box');
                        
                        output.empty();
                        data.forEach(function(video){
                             console.log(video);
                             var mdate=getExactDate(video.created);
                             //var vidurl="https://www.youtube.com/embed/"+video.videoPath.split("=").pop();
                               // console.log(vidurl);
                             output.mustache('video-template', {id:video._id, title: video.title,date:mdate,url:video.videoPath,desc:video.desc });
                         });
                       
                    });
               
                // here we will handle errors and validation messages
            })
            .fail(function(data){
        
                console.log(data);
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
                /*
                    
                */
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
  
  sendobject=JSON.stringify($('#addAudioForm').serializeObject());
  console.log(sendobject);
  $.ajax({
      type:'POST',
      
  });
  getAudios();

 

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
                $.Mustache.load('templates/audio.htm')
					.fail(function () { 
						console.log('Failed to load templates from <code>templates.htm</code>');
					})
					.done(function () {
                        var output=$('#audio-box');
                        
                        output.empty();
                        data.forEach(function(audio){
                            console.log(audio);
                             var mdate=getExactDate(audio.created);
                             output.mustache('audio-template', { id:audio._id,title: audio.title,date:mdate,url:globalroot+audio.audioPath });
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
                
                /*
                    
                */
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
                        data.forEach(function(video){
                            
                             var mdate=getExactDate(video.created);
                             output.mustache('live-video-template', {id:video._id, title: video.title,date:mdate,url:video.videoPath,desc:video.desc });
                         });
                       
                    });
               
                // here we will handle errors and validation messages
            })
            .fail(function(data){
        
                console.log(data);
            });
}

function deleteLiveVideo(video){
    id=video.split("-")[1];
    
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
