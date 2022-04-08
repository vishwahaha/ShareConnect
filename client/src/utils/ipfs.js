import { create } from 'ipfs-http-client'

// connect to the default API address http://localhost:5001
const ipfs = create();

export default ipfs;