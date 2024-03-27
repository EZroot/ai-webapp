use actix_web::{web, HttpResponse};
use diesel::{prelude::*, result::Error};
use crate::models::diesel_user::NewUser;
use crate::schema::users::dsl::*;
use diesel::r2d2::{ConnectionManager, Pool};
use bcrypt;

type DbPool = Pool<ConnectionManager<PgConnection>>;

pub fn get_connection_pool() -> DbPool {
    let database_url = "postgres://postgres:password@localhost/my_database_name";
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    Pool::builder()
        .test_on_check_out(true)
        .build(manager)
        .expect("Could not build connection pool")
}

pub fn create_user(conn: &mut PgConnection, new_user: &NewUser) -> Result<usize, Error> {
    let hashed_password = hash_password(&new_user.password_hash).unwrap();
    println!("Password: {}\nInserting into database!", &hashed_password);
    diesel::insert_into(users)
        .values(NewUser {
            username: new_user.username.to_string(),
            password_hash: hashed_password,
            email: new_user.email.to_string(),
            role: new_user.role.to_string(), 
        })
        .execute(conn)
}

pub fn delete_user(conn: &mut PgConnection, user_id: i32) -> Result<usize, Error> {
    diesel::delete(users.find(user_id))
        .execute(conn)
}
    
fn hash_password(password: &str) -> Result<String, bcrypt::BcryptError> {
    bcrypt::hash(password, bcrypt::DEFAULT_COST)
}


#[cfg(test)]
mod tests {
    use super::*;

    mod create_user {
        use super::*;

        #[test]
        fn test() {
            let pool = get_connection_pool();
            let mut conn = pool.get().expect("Couldn't get DB connection from pool");

             // Retrieve the created user
             let user_id = users.filter(username.eq("create_user"))
             .select(id)
             .first::<i32>(&mut conn)
             .expect("Failed to retrieve user");

         // Delete the user
         let delete_result = delete_user(&mut conn, user_id);
         assert!(delete_result.is_ok(), "Failed to create user");

            // Create a new user
            let new_user = NewUser {
                username: "create_user".to_string(),
                password_hash: "asdasdasdasdasdasdasdasdasd".to_string(), // Invalid password
                email: "create_user@create_user.com".to_string(),
                role: "user".to_string(),
            };
            let result = create_user(&mut conn, &new_user);
            assert!(result.is_ok(), "Failed to create user");
        }
    }

    mod delete_user {
        use super::*;

        #[test]
        fn test() {
            let pool = get_connection_pool();
            let mut conn = pool.get().expect("Couldn't get DB connection from pool");
            let new_user = NewUser {
                username: "delete_user".to_string(),
                password_hash: "asdasdasdasdzxczxc".to_string(), // Invalid password
                email: "delete_user@delete_user.com".to_string(),
                role: "user".to_string(),
            };
            let result = create_user(&mut conn, &new_user);
            assert!(result.is_ok(), "Failed to create user");

            // Retrieve the created user
            let user_id = users.filter(username.eq("delete_user"))
                .select(id)
                .first::<i32>(&mut conn)
                .expect("Failed to retrieve user");

            // Delete the user
            let delete_result = delete_user(&mut conn, user_id);
            assert!(delete_result.is_ok(), "Failed to delete user");
        }
    }


    // mod create_user_invalid_password {
    //     use super::*;

    //     #[test]
    //     fn test() {
    //         let pool = get_connection_pool();
    //         let mut conn = pool.get().expect("Couldn't get DB connection from pool");

    //         // Attempt to create a user with an invalid password
    //         let new_user = NewUser {
    //             username: "invaliduserpass".to_string(),
    //             password_hash: "".to_string(), // Invalid password
    //             email: "aaaaaaa@invalliduserpass.com".to_string(),
    //             role: "user".to_string(),
    //         };
    //         let result = create_user(&mut conn, &new_user);
    //         assert!(result.is_err(), "Expected creation to fail with invalid password");
    //     }
    // }

    // mod delete_nonexistent_user {
    //     use super::*;

    //     #[test]
    //     fn test() {
    //         let pool = get_connection_pool();
    //         let mut conn = pool.get().expect("Couldn't get DB connection from pool");

    //         // Attempt to delete a user that doesn't exist
    //         let delete_result = delete_user(&mut conn, -1); // Non-existent user ID
    //         assert!(delete_result.is_err(), "Expected deletion to fail for non-existent user");
    //     }
    // }
}
