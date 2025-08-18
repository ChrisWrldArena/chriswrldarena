/* eslint-disable @typescript-eslint/no-explicit-any */



export const getLocationData = async (ip: string) => {
    try {
        const headersList = {
            "Accept": "*/*",
            "contentType": "application/json",
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36",
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        }

        const url = process.env.NODE_ENV === "development" ? `https://api.ipdata.co/?api-key=eca677b284b3bac29eb72f5e496aa9047f26543605efe99ff2ce35c9` : `https://api.ipdata.co/${ip}?api-key=eca677b284b3bac29eb72f5e496aa9047f26543605efe99ff2ce35c9`
       
        const response = await fetch(url, {
            method: 'GET',
            headers: headersList,
            referrer: "https://ipdata.co/",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: null,
            mode: "cors",
            credentials: "omit"
        })

        if (response.ok) {
            const result = await response.json()
            return JSON.stringify({
                country: result.country_name,
                countryCode: result.country_code,
                city: result.city,
                region: result.region,
                currencyname: result.currency.name,
                currencycode: result.currency.code,
                currencysymbol: result.currency.symbol,
                flag: result.flag,
            })
        }
        else {
            throw new Error(response.statusText)
        }

    } catch (error: any) {
        throw new Error(error.message)

    }
}