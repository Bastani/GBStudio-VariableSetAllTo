const alphaRX = /\D?/;
const numRX = /\d+/;

export const id = "EVENT_BASTANI_SET_ALL_TO";

export const name = "Variable: Set All To";

const updateVars = (args) => 
{	
	var variables = {};
	
	var Ipre = (args.firstVariable.match(alphaRX) || [""])[0];
	var Inum = Number(args.firstVariable.match(numRX)[0]);
    var Onum = Number(args.lastvariable.match(numRX)[0]);
    
    Onum = Ipre == "L" && Onum > 5 ? 5 : Onum;
    Onum = Ipre == "T" && Onum > 1 ? 1 : Onum;
    Onum = Ipre == "V" && Onum > 9 ? 9 : Onum;

	var length = Inum < Onum ? (1 + Onum) - Inum : 1;
  
	for (let j = 0; j < 512; j++) {
		variables["variable"+j] = j < length ? Ipre + (Inum + j) : 0;
	}
    variables["lastvariable"] = Ipre + (Inum + length - 1);
    
    args.length = length;
	
	return variables;
}

const fields = [].concat(
    [
        {
            key: "value",
            label: "Number to set to",
            type: "number",
            min: 0,
            max: 255,
            defaultValue: 0
        },
        {
            key: "length",
            labe: "Length",
            type: "number",
            hide: true
        },
        {
            key: "firstVariable",
            label: "Destination First Variable",
            type: "variable",
            defaultValue: "0",
            postUpdate: (args) => 
            {
                vars = updateVars(args);
                    return {
                    ...args,
                    ...vars
                    };
                }
            },
        {
            key: "lastvariable",
            label: "Last Variable",
            type: "variable",
            defaultValue: "0",
            postUpdate: (args) => 
            {
                vars = updateVars(args);
                    return {
                    ...args,
                    ...vars
                    };
                }
            }
        ] ,
        Array(512)
        .fill()
        .reduce((arr, _, i) => 
        {
            arr.push({
            key: `variable${i}`,
            hide: true,
            type: "variable",
            defaultValue: i
            });
            return arr;
        }, []),
    );

const compile = (input, helpers) => 
{
    const { textDialogue } = helpers;
    const value = parseInt(input.value, 10);
    if (value > 1)  
    {
        const { variableSetToValue } = helpers;
        for (let i = 0; i < input.length; i++) 
        {
            var variable = input["variable"+i];
            variableSetToValue(variable, value);
        }
    } 
    else if (value === 1) 
    {
        const { variableSetToTrue } = helpers;
        for (let i = 0; i < input.length; i++) 
        {
            var variable = input["variable"+i];
            variableSetToTrue(variable);
        }
    } 
    else 
    {
        const { variableSetToFalse } = helpers;
        for (let i = 0; i < input.length; i++) 
        {
            var variable = input["variable"+i];
            variableSetToFalse(variable);
        }
    }
};

const generateString = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const customTemporaryVariable = (result) => String(result + 490);

const canInteract = 489;

const globalZero = 511;

module.exports = 
{
	id,
	name,
	fields,
	compile
};