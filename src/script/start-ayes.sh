#!/bin/bash

python3 $AYES_INSTALL/dncloud/scripts/gen_new_admin.py &
sleep 5s
echo "----- Starting API server at background -----"
python3 $AYES_INSTALL/dncloud/api/main.py &
echo "----- Started API server -----"

case $1 in
  active)
    echo "----- Starting DICOM server as active mode at background -----"
    python3 $AYES_INSTALL/dncloud/dcmtool/dcmscu.py &
    echo "----- Started DICOM server -----"
    ;;
  passive)
    echo "----- Starting DICOM server as passive mode at background -----"
    python3 $AYES_INSTALL/dncloud/dcmtool/dcmscp.py &
    echo "----- Started DICOM server -----"
    ;;
  *)
esac
sleep 5s

echo "----- Starting WebSocket  server at background -----"
python3 $AYES_INSTALL/dncloud/sse/main.py &
echo "----- Started WebSocket server -----"

echo "----- Starting worker at foreground -----"
python3 $AYES_INSTALL/dncloud/compute/worker.py 

