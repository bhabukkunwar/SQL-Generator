var fs  = require ('fs');

var tablename = 'HTS_D';
var counter = 0 , bracket;
var appender, colname, pkconst;

pkconst='';
colname='';
bracket=false;


fs.readFile(`./${tablename}.csv`, 'utf-8', (err, data) => {
    // console.log(tablename.substring(4));           //bbk
    
    if (!err && tablename.substring(0,3)=='EXT') {
        // console.log(data);
        createquery = 'create table ' + tablename + '( \n' ;
        createquery_rej = 'create table ' + `REJ_${tablename.substring(4)}` + '( \n' ;
        createquery_rej += 'BATCH_ID NUMBER,\nPROCESS_LOG_ID NUMBER(12) NOT NULL,\nLINE_SEQ NUMBER NOT NULL,\nSTATUS VARCHAR2(1),\nERROR_MESSAGE VARCHAR2(250),\n';
       
        for (let i = 0; i <= data.length; ++i) {
            appender = data.substring(i,i+1);
          

            if (appender == ',' && bracket==false) {
                counter += 1;
                createquery = createquery + ' ';
                createquery_rej = createquery_rej + ' ';
            }
            else if (counter == 1) {
                if (appender == 'Y') {
                    if (pkconst == '') {
                        pkconst = colname;
                    }
                    else {
                        pkconst = pkconst + ', ' + colname;
                    }
                }
                else if (appender == ',') {
                    createquery = createquery + ' ' + appender;
                    createquery_rej = createquery_rej + ' ' + appender;
                } 
                else if(appender==' '){

                    createquery = createquery + ' ' + appender;
                    createquery_rej = createquery_rej + ' ' + appender;
                }
                else{

                    counter += 1;
                }
            }
            else if (counter == 3) {
                if (appender == 'N') {
                    createquery = createquery + ' NOT NULL' + ',';
                    createquery_rej = createquery_rej + ' NOT NULL' + ',';
                    counter = 0;
                    colname = '';
                }
                else {
                    createquery = createquery + ',\n';
                    createquery_rej = createquery_rej + ',\n';
                    colname = '';
                    counter = 0;
                }
            }
            else if (appender == '(')
            {
                // console.log(bracket);
                bracket = true;
                // console.log(bracket);
                createquery = createquery + appender;
                createquery_rej = createquery_rej + appender;
            }
            else if (appender==')'){
                    bracket = false;
                    createquery = createquery + appender;
                    createquery_rej = createquery_rej + appender;

            }
            else {
                createquery = createquery + appender;
                createquery_rej = createquery_rej + appender;
                
                colname = colname + appender;
                // console.log(colname);
            }
        }
      
        createquery = createquery + 'CONSTRAINT ' + tablename + '_PK1 PRIMARY_KEY (' + pkconst + ')';
        createquery = createquery + ')';

        // createquery = createquery + 'DW_REJECTED_TS TIMESTAMP (0) NOT NULL,\n'
        createquery_rej = createquery_rej + 'DW_REJECTED_TS TIMESTAMP (0) NOT NULL,'+'\n'+ 'CONSTRAINT ' + `REJ_${tablename.substring(4)}` + '_PK1 PRIMARY_KEY (' + pkconst + ')';
        createquery_rej = createquery_rej + ')';

        console.log('EXT TABLE RUN');

        fs.writeFile(`./${tablename}.sql`, createquery, (err) => {
            if (err) {
                throw err;
            }
        })
        
        fs.writeFile(`./REJ_${tablename.substring(4)}.sql`, createquery_rej, (err) => {
            if (err) {
                throw err;
            }
        })

    }
    

        
    if (!err && tablename.substring(0,3)!='EXT') {
                // console.log(data);
                createquery = 'create table ' + tablename + '( \n' ;
                createquery_tmp = 'create table TMP_' + tablename + '( \n' ;
               
                for (let i = 0; i <= data.length; ++i) {
                    appender = data.substring(i,i+1);
                  
        
                    if (appender == ',' && bracket==false) {
                        counter += 1;
                        createquery = createquery + ' ';
                        createquery_tmp = createquery_tmp + ' ';
                    }
                    else if (counter == 1) {
                        if (appender == 'Y') {
                            if (pkconst == '') {
                                pkconst = colname;
                            }
                            else {
                                pkconst = pkconst + ', ' + colname;
                            }
                        }
                        else if (appender == ',') {
                            createquery = createquery + ' ' + appender;
                            createquery_tmp = createquery_tmp + ' ' + appender;
                        } 
                        else if(appender==' '){
        
                            createquery = createquery + ' ' + appender;
                            createquery_tmp = createquery_tmp + ' ' + appender;
                        }
                        else{
        
                            counter += 1;
                        }
                    }
                    else if (counter == 3) {
                        if (appender == 'N') {
                            createquery = createquery + ' NOT NULL' + ',';
                            createquery_tmp = createquery_tmp + ' NOT NULL' + ',';
                            counter = 0;
                            colname = '';
                        }
                        else {
                            createquery = createquery + ',\n';
                            createquery_tmp = createquery_tmp + ',\n';
                            colname = '';
                            counter = 0;
                        }
                    }
                    else if (appender == '(')
                    {
                        // console.log(bracket);
                        bracket = true;
                        // console.log(bracket);
                        createquery = createquery + appender;
                        createquery_tmp = createquery_tmp + appender;
                    }
                    else if (appender==')'){
                            bracket = false;
                            createquery = createquery + appender;
                            createquery_tmp = createquery_tmp + appender;
        
                    }
                    else {
                        createquery = createquery + appender;
                        createquery_tmp = createquery_tmp + appender;
                        
                        colname = colname + appender;
                        // console.log(colname);
                    }
                }
                // createquery = createquery + 'DW_REJECTED_TS TIMESTAMP (0) NOT NULL,\n'
                createquery = createquery + 'CONSTRAINT ' + tablename + '_PK1 PRIMARY_KEY (' + pkconst + ')';
                createquery = createquery + ')';

                createquery_tmp = createquery_tmp + 'CONSTRAINT TMP_' + tablename + '_PK1 PRIMARY_KEY (' + pkconst + ')';
                createquery_tmp = createquery_tmp + ')';
                
                console.log('tgt TABLE RUN');

                // console.log(createquery);
                fs.writeFile(`./${tablename}.sql`, createquery, (err) => {
                    if (err) {
                        throw err;
                    }
                })
                fs.writeFile(`./TMP_${tablename}.sql(change)`, createquery_tmp, (err) => {
                    if (err) {
                        throw err;
                    }
                })
        
            }
            // else {
            //         throw err;
            //     }
        
    
    // else 
    //     throw err;
});