#!/bin/bash

if ! screen -ls | grep -q "\.icare-backend"; then
        echo "iCare is not running."
        exit 1
fi

screen -S icare-backend -X quit
