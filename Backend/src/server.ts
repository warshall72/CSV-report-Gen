import app from './app';
import Config from './config/env';

const port = Config.PORT || 3000;

app.listen(port, () => {
    require('fs').appendFileSync('server_start.log', `Server started on port ${port}\n`);
    console.log(`Server running on port ${port}`);
    console.log(`Docs available at http://localhost:${port}/api-docs`);
});
