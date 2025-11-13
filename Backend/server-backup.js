// This is the backup of the original server.js with JSON file storage
// Keep this file as reference for local development

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const fs = require('fs-extra');
const path = require('path');

// Original server.js content with file-based storage
// This file is kept as a backup for local development
// The main server.js now uses MongoDB for cloud deployment
