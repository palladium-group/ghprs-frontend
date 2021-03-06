import { connect } from "react-redux";
import React, { useEffect } from "react";
import Page from 'components/Page';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Col,
  Row,
  NavLink as BSNavLink,
} from 'reactstrap';
import { NavLink, Link } from 'react-router-dom';
import { MdAccountCircle, MdDelete, MdAdd, MdArrowBack } from "react-icons/md";
import { fetchAll } from "../actions/users";
import MaterialTable from 'material-table'
import axios from "axios";
import { url } from "../api";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";
const UsersPage = (props) => {

  useEffect(() => {
    props.fetchUsers();
  }, []);
  const currentUsername = JSON.parse(localStorage.getItem('currentUser')) ? jwt_decode(JSON.parse(localStorage.getItem('currentUser')).token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] : '';
  function deleteUser(e) {
    if (e.currentTarget.name === currentUsername) {
      toast.error("Could not delete User " + e.currentTarget.name + ". User " + e.currentTarget.name + " is the current logged in user.");
    } else {
      try {
        axios.delete(`${url}users/` + e.currentTarget.id)
          .then((response) => {
            toast.success("User " + e.currentTarget.name + " Successfully Deleted");
            setTimeout(() => {
              props.fetchUsers();
            }, 2500);
          });
      } catch (e) {
        toast.error("Could not delete User");
        console.error(e);
      }
    }
  }
  return (
    <Page
      className="DashboardPage"
    >
      <Row>
        <Col xl={12} lg={12} md={12}>
          <Card>
          <CardHeader>
              Users
              <Link to="/administration">
            <Button
              variant="contained"
              color="link"
              className=" float-right mr-1"
            >
              <MdArrowBack size="15" />{" "}
              <span style={{ textTransform: "capitalize" }}>Back</span>
            </Button>
          </Link>
            </CardHeader>
            <CardBody>
              Manage user access to the portal. Users are either normal users or admins which controls what features they have access to in the system
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg="12" md="12" sm="12" xs="12">
          <MaterialTable
            columns={[
              { title: 'Name', field: 'name' },
              { title: 'Email', field: 'email' },
              { title: 'Organization', field: 'organization' },
              { title: 'Actions', field: 'actions' }
            ]}
            data={props.users.map((row) => ({
              name: row.person.name,
              email: row.email,
              organization: row.organization.shortName,
              actions: (
                <>
                <BSNavLink
                    id={`profile${row.id}`}
                    tag={NavLink}
                    to={`/profile/${row.id}`}
                    activeClassName="active"
                    exact={true}
                  >
                    <MdAccountCircle size="15" />{" "}
                    <span style={{ color: "#000" }}>View Profile</span>
                  </BSNavLink>
                  <Button
                    color="link"
                    onClick={deleteUser}
                    id={row.id}
                    name={row.userName}
                  >
                    <MdDelete size="15" />{" "}
                    <span style={{ color: "#000" }}  >Delete User</span>
                  </Button>
                </>

              ),
            }))}
            title={<Link to="/register">
            <Button
              variant="contained"
              color="link"
              className=" float-right mr-1"
            >
              <MdAdd size="15" />{" "}
              <span style={{ textTransform: "capitalize" }}>Add User</span>
            </Button>
          </Link>}
          />
        </Col>
      </Row>
    </Page>
  );
}

const mapStateToProps = (state) => {
  return {
    users: state.users.list,
  };
};

const mapActionToProps = {
  fetchUsers: fetchAll,
};

export default connect(mapStateToProps, mapActionToProps)(UsersPage);