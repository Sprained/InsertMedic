const Sequelize = require('sequelize');
const csv = require('csv-parser');
const fs = require('fs');

const config= {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'medic',
    define: {
        freezeTableName: true,
        timestamps: false
    }
}
const sequelize = new Sequelize(config);

fs.createReadStream('./especialidades-medicas-gov.csv')
    .pipe(csv())
    .on('data', async (row) => {
        const [, medic] = JSON.stringify(row).split(':');
        const query = `INSERT INTO 
                            medic ( nome )
                        VALUES
                            ('${medic.substr(1, medic.length - 3)}')`;
        await sequelize.query(query, {
            type: sequelize.QueryTypes.INSERT
        });
    })
    .on('end', () => {
        console.log('CSV gravado!')
    });