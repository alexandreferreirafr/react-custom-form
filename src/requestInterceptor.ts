const nativeFetch = window.fetch

window.fetch = function(input, init) {
    if (/\/api\/sort/.test(input as string) && init?.method === 'POST') {
        const { body } = init
        const data = JSON.parse(body as string)
        const response = Object.values(data)
            .map(Number)
            .filter(item => !isNaN(item))
            .sort((a, b) => a - b)
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                return resolve({
                    status: 200,
                    ok: true,
                    json: () => Promise.resolve(response)
                } as Response)
            },300)
        }) 
    }
    
    return nativeFetch(input, init)
}

export {}
