/*
 * 
 */
var FileDownload = {};

FileDownload.isFinished = function(successCallback,failureCallback) {

    //Check if file is started downloading
    if (Ext.util.Cookies.get('fileDownload') && Ext.util.Cookies.get('fileDownload')=='true' ) {
    	//Remove cookie call success callback 
        Ext.util.Cookies.set('fileDownload', null, new Date("January 1, 1970"),application.contextPath+'/');
        Ext.util.Cookies.clear('fileDownload',application.contextPath+'/');
        successCallback();
        return;
    } 

    //Check for error / IF any error happens then frame will load with content
    try {
    	if(Ext.getDom('hiddenframe-frame').contentDocument.body.innerHTML.length>0){
    		Ext.util.Cookies.set('fileDownload', null, new Date("January 1, 1970"),application.contextPath+'/');
            Ext.util.Cookies.clear('fileDownload',application.contextPath+'/');
        	failureCallback();
        	//Cleanup
        	Ext.getDom('hiddenframe-frame').contentDocument.body.innerHTML = ""; 
        	
        	return;
        }
    } 
    catch (e) {
    	console.log(e);
    }
    
    console.log('polling..');
    // If we are here, it is not loaded. Set things up so we check   the status again in 100 milliseconds
    window.setTimeout('FileDownload.isFinished('+successCallback+','+failureCallback+')', 100);
};

FileDownload.downloadFile = function(arguments) {
	
	var url = arguments['url'];
	var params = arguments['params'];
	var successCallback = arguments['success'];
	var failureCallback = arguments['failure'];
	
	var body = Ext.getBody();

	var frame = body.createChild({
	tag:'iframe',
	cls:'x-hidden',
	id:'hiddenframe-frame',
	name:'iframe'
	});

	var form = body.createChild({
	tag:'form',
	cls:'x-hidden',
	id:'hiddenform-form',
	action: url,
	method: 'POST',
	target:'iframe'
	});
	

	if (params)
	{
		for (var paramName in params)
		{
			
			form.createChild({
				tag:'input',
				cls:'x-hidden',
				id:'hiddenform-'+paramName,
				type: 'text',
				text: params[paramName],
				target:'iframe',
				value: params[paramName],
				name: paramName
				});
	
		}
	}
	
	form.dom.submit();
	
	FileDownload.isFinished(successCallback,failureCallback);
};
