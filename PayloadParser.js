function parseUplink(device, payload) {

    var payloadb = payload.asBytes();
    var decoded = Decoder(payloadb, payload.port)
    env.log(decoded);

    // People Count IN
    if (decoded.counter_a != null) {
        var sensor1 = device.endpoints.byAddress("1");

        if (sensor1 != null)
            sensor1.updateGenericSensorStatus(decoded.counter_a);
    };

    // People Count OUT
    if (decoded.counter_b != null) {
        var sensor2 = device.endpoints.byAddress("2");

        if (sensor2 != null)
            sensor2.updateGenericSensorStatus(decoded.counter_b);
    };

    // People Count Total A
    if (decoded.total_counter_a != null) {
        var sensor3 = device.endpoints.byAddress("3");

        if (sensor3 != null)
            sensor3.updateGenericSensorStatus(decoded.total_counter_a);
    };

    // People Count Total B
    if (decoded.total_counter_b != null) {
        var sensor4 = device.endpoints.byAddress("4");

        if (sensor4 != null)
            sensor4.updateGenericSensorStatus(decoded.total_counter_b);
    };

    // People Count Total A-B
    if (decoded.total_counter_b != null) {
        var sensor5 = device.endpoints.byAddress("5");
        var sum = device.endpoints.byAddress("5").getCurrentState().value;

        if (sensor5 != null)
            sensor5.updateGenericSensorStatus(sum+decoded.counter_a-decoded.counter_b);
    };

    // Store battery
    if (decoded.battery != null) {
        var sensor1 = device.endpoints.byAddress("6");

        if (sensor1 != null)
            sensor1.updateVoltageSensorStatus(decoded.battery);
            device.updateDeviceBattery({ voltage: decoded.battery });

    };
}


function buildDownlink(device, endpoint, command, payload) 
{ 
	// This function allows you to convert a command from the platform 
	// into a payload to be sent to the device.
	// Learn more at https://wiki.cloud.studio/page/200

	// The parameters in this function are:
	// - device: object representing the device to which the command will
	//   be sent. 
	// - endpoint: endpoint object representing the endpoint to which the 
	//   command will be sent. May be null if the command is to be sent to 
	//   the device, and not to an individual endpoint within the device.
	// - command: object containing the command that needs to be sent. More
	//   information at https://wiki.cloud.studio/page/1195.

	// This example is written assuming a device that contains a single endpoint, 
	// of type appliance, that can be turned on, off, and toggled. 
	// It is assumed that a single byte must be sent in the payload, 
	// which indicates the type of operation.

/*
	 payload.port = 25; 	 	 // This device receives commands on LoRaWAN port 25 
	 payload.buildResult = downlinkBuildResult.ok; 

	 switch (command.type) { 
	 	 case commandType.onOff: 
	 	 	 switch (command.onOff.type) { 
	 	 	 	 case onOffCommandType.turnOn: 
	 	 	 	 	 payload.setAsBytes([30]); 	 	 // Command ID 30 is "turn on" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.turnOff: 
	 	 	 	 	 payload.setAsBytes([31]); 	 	 // Command ID 31 is "turn off" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.toggle: 
	 	 	 	 	 payload.setAsBytes([32]); 	 	 // Command ID 32 is "toggle" 
	 	 	 	 	 break; 
	 	 	 	 default: 
	 	 	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 	 	 break; 
	 	 	 } 
	 	 	 break; 
	 	 default: 
	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 break; 
	 }
*/

}

/* 
*  Decoder function for The Things Network to unpack the payload of the IMBuildings LoRaWAN People Counter
*  The counters are available here: https://connectedthings.store/gb/imbuildings-lorawan-people-counter-eu868.html
*
*  This function was created by Cameron Sharp at Sensational Systems - cameron@sensational.systems
*/


function Decoder(bytes, port) {
    var params = {
        "bytes": bytes
    };

    // Device stats
    params.battery = ((bytes[11] << 8) | bytes[12]) / 100;
    params.sensor_status = bytes[17];
    params.payload_counter = bytes[22];

    // There are separate counters for people travelling in each direction. These directions are marked on the units.
    // There are also running total counts (one for each direction), useful if some packets are lost.
    
    // Count of people travelling from counter_a to counter_b
    params.counter_a = (bytes[13] << 8) | bytes[14];
    params.total_counter_a = (bytes[18] << 8) | bytes[19];

    // Count of people travelling from counter_b to counter_a
    params.counter_b = (bytes[15] << 8) | bytes[16];
    params.total_counter_b = (bytes[20] << 8) | bytes[21];

    return params;
  }