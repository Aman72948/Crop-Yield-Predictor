f = open('../frontend/src/App.jsx', 'r', encoding='utf-8')
code = f.read()
f.close()

code = code.replace('background:"transparent"', 'background:"#fff",color:"#000"')

f = open('../frontend/src/App.jsx', 'w', encoding='utf-8')
f.write(code)
f.close()
print('Fixed!')