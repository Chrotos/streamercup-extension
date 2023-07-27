#!/usr/bin/env bash
docker run -p 6001:6001 -p 9601:9601 --name soketi \
      -e SOKETI_DEFAULT_APP_USER_AUTHENTICATION=true \
      -e SOKETI_DEFAULT_APP_ID=ID \
      -e SOKETI_DEFAULT_APP_KEY=KEY \
      -e SOKETI_DEFAULT_APP_SECRET=SECRET \
      quay.io/soketi/soketi:1.4-16-debian