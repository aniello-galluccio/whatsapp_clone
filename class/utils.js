module.exports = class Utils {
    
    //unica cosa non prevista è che si passi un array con due o più valori uguali EX: [1, 2, 3] è uguale a [1, 1, 2]
    static compareArr(arr1, arr2)
    {
        const len1 = arr1.length;
        const len2 = arr2.length;

        if(len1 !== len2)
        {
            return false;
        }

        for(let i=0; i<len1; i++)
        {
            for(let j=0; j<len2; j++)
            {
                if(arr1[i] === arr2[j])
                {
                    break;
                }

                if(j === len2 - 1)
                {
                    return false;
                }
            }
        }

        return true;
    }

    static removeIdQuotes(id)
    {
        const len = id.length;
        let newStr = "";

        if(id.charAt(0) === `"` && id.charAt(len - 1) === `"`)
        {
            for(let i=0; i<len; i++)
            {
                if(i !==0 && i !== len -1)
                {
                    newStr += id.charAt(i);
                }
            }

            return newStr;
        }
        else
        {
            return id;
        }
    }

    static compare(a, b)
    {
        if(a<b)
        {
            return 1;
        }
        if(a>b)
        {
            return -1;
        }

        return 0;
    }
}