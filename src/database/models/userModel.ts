import { Table, Column, Model, DataType, AllowNull} from 'sequelize-typescript';

@Table({
    tableName: 'users',
    modelName: 'User',
    timestamps: true
})
class User extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.STRING
    })
    declare username: string;

    @Column({
        type: DataType.STRING
    })
    declare password: string;

    @Column({
        type: DataType.STRING
    })
    declare email: string;

    @Column({
        type: DataType.ENUM('institue', 'teacher', 'super-admin', 'student'),
        defaultValue: 'student'
    })
    declare role: string;
}

export default User;