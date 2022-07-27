import getopt, sys
from json import dumps
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

def main():
    argumentList = sys.argv[1:]
    options = 'f:'
    long_options = ['file=']
    filename = ''

    try:
        arguments, values = getopt.getopt(argumentList, options, long_options)

        for currentArgument, currentValue in arguments:
            if currentArgument in ('-f', f'--{long_options[0].replace("=", "")}'):
                filename = currentValue.strip()
    except getopt.error as err:
        print(str(err))
        sys.exit(2)
    
    try:
        data = pd.read_csv(filename)
    except FileNotFoundError:
        print('File:', filename, 'not found')
        sys.exit(2)

    matrix = np.array(data.values, 'float')
    x = matrix[:,0].reshape((-1,1))
    y = matrix[:,1]
    
    model = LinearRegression()
    model.fit(x,y)

    coef = model.coef_
    intercept = model.intercept_

    if type(coef) == np.ndarray:
        coef = coef[0]

    data = {
        'coef': coef,
        'intercept': intercept,
    }
    print(dumps(data))
    sys.stdout.flush()

if __name__ == '__main__':
    main()