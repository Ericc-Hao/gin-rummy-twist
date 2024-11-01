/*
* Authentication Module
* Author: Qixuan, zhongq7@mcmaster.ca
* Description: Provide authentication support
*/

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class Authentication {
    public static void main(String[] args) {
        System.out.println("Hello World");
        create_account("Alice", "Alice_password");
        create_account("Bob", "Bob_password");
        create_account("Charlie", "Charlie_password");
        create_account("David", "David_password");
        System.out.println("-------------------------------");
        verify_account("Alice", "Alice_password");
        verify_account("Bob", "Boo_password");
        verify_account("Trudy", "Bob_password");
        System.out.println("-------------------------------");
        verify_account("Charlie", "Charlie_password");
        change_password("Charlie", "Charlie_password", "Charlie_new_password");
        verify_account("Charlie", "Charlie_password");
        verify_account("Charlie", "Charlie_new_password");
        System.out.println("-------------------------------");
        verify_account("David", "David_password");
        remove_account("David", "David_password");
        verify_account("Alice", "Alice_password");
        verify_account("David", "David_password");
    }   
    /*
     * The following two methods should be replaced with an actual database
     */
    private static Map<String, String> fake_database = new HashMap() ;
    private static int save_to_database(String key, String value){
        fake_database.put(key, value);
        return 0;
    }
    private static String read_from_database(String key){
        return fake_database.get(key);
    }
    private static String delete_on_database(String key){
        return fake_database.remove(key);
    }
    private static String hashWith256(String textToHash) {
        try
        {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] byteOfTextToHash = textToHash.getBytes(StandardCharsets.UTF_8);
            byte[] hashedByetArray = digest.digest(byteOfTextToHash);
            String encoded = Base64.getEncoder().encodeToString(hashedByetArray);
            return encoded;
        }
        catch (Exception e)
        {}
        return "";
    }

    public static int create_account(String user_name, String password){
        //Check for username
        if (read_from_database(user_name) != null){
            //Return 21 for duplicated user name
            return 21;
        }

        //TODO: Check for the format of password
        if (password.equals("Some invalid password") ){
            //Return 22 for malformed password
            return 22;
        }

        //Encode password
        password = hashWith256(password);
        if (password.length() < 1){
            return 11;
        }

        if (save_to_database(user_name, password) != 0){
            return 12;
        }
        return 0;
    }

    public static int verify_account(String user_name, String password){

        if (read_from_database(user_name) == null){
            System.out.println("User not found");
            return 11;
        }
        password = hashWith256(password);
        if (! read_from_database(user_name).equals(password)){
            System.out.println("Wrong password");
            return 12;
        }
        System.out.println(user_name + " Access Granted");
        return 0;
    }

    public static int remove_account(String user_name, String password){
        if (verify_account(user_name, password) == 0){
            delete_on_database(user_name);
            System.out.println("Removed account for " + user_name);
            return 0;
        }

        return 1;
    }

    public static int change_password(String user_name, String old_password, String new_password){
        if (verify_account(user_name, old_password) == 0){
            remove_account(user_name, old_password);
            create_account(user_name, new_password);
            System.out.println("Changed password for " + user_name);
            return 0;
        }
        return 1;
    }
}