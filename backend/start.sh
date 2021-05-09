#!/bin/bash

if screen -ls | grep -q "\.icare-backend"; then
	echo "iCare is already running."
	echo "Type 'screen -r icare-backend'."
	exit 1
fi

screen -dmS icare-backend npm start
