import { connect } from "react-redux";
import { url } from "../api";
import React, { useEffect, useState } from "react";
import Page from 'components/Page';
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Col,
  Row,
  NavLink as BSNavLink,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { toast } from "react-toastify";
import { MdFileDownload, MdModeEdit, MdSettings } from "react-icons/md";
import { fetchAll, getById, updateStatus } from "../actions/template";
import MaterialTable from 'material-table'
import { authentication } from "../_services/authentication";
import useForm from '../functions/UseForm';

let templateId = 0;

const status = [
  { id: 0, name: 'Not Configured' },
  { id: 1, name: 'Active' },
  { id: 2, name: 'Archived' },
];

const frequency = [
  { name: 'Weekly', id: 0 },
  { name: 'Monthly', id: 1 },
  { name: 'Quarterly', id: 2 },
  { name: 'Yearly', id: 3 },
  { name: 'Adhoc', id: 4 },
];

const statusForm = {
  status: 0
};

const TemplateDownloadPage = (props) => {

  const [modal, setModal] = useState(false);

  const { values, handleInputChange, resetForm } = useForm(
    statusForm
  );

  useEffect(() => {
    props.fetchTemplates();
  }, []);

  const toggleUpdate = (id) => {
    templateId = id;
    setModal(!modal);
    if (!modal) {
      props.getTemplate(id);
    }
  };

  const handleStatus = event => {
    event.preventDefault();
    const onSuccess = () => {
      toast.success("Status updated successfully");
      resetForm();
      props.fetchTemplates();
    };
    const onError = () => {
      toast.error("Something went wrong");
    };
    props.updateStatus(templateId, values.status, onSuccess, onError);
  };

  return (
    <Page
      className="DashboardPage"
    >
      <Row>
        <Col xl={12} lg={12} md={12}>
          <Card>
            <CardHeader>
              Downloads
            </CardHeader>
            <CardBody>
              Blank template downloads that will be used to collect and upload data into the system.
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg="12" md="12" sm="12" xs="12">
          <MaterialTable
            columns={[
              { title: 'Name', field: 'name' },
              { title: 'Description', field: 'description' },
              { title: 'Version', field: 'version' },
              { title: 'Frequency', field: 'frequency' },
              { title: 'Status', field: 'status' },
              { title: 'Actions', field: 'actions' }
            ]}
            data={props.templates.map((row) => ({
              name: row.name,
              description: row.description,
              version: row.version,
              frequency: frequency.find(o => o.id === row.frequency).name,
              status: status.find(o => o.id === row.status).name,
              actions: (
                <div>
                  {(authentication.currentRole === 'Administrator' && row.status === 0) && (<BSNavLink
                    id={`configure${row.id}`}
                    tag={NavLink}
                    to={`/configure/${row.id}`}
                    activeClassName="active"
                    exact={true}
                  >
                    <MdSettings size="15" />{" "}
                    <span style={{ color: "#000" }}>Configure</span>
                  </BSNavLink>)}
                  <a
                    href={`${url}templates/download/${row.id}`} target="_blank" rel="noopener noreferrer"
                    id={`navItem-${row.name}-${row.id}`}
                  >
                    <MdFileDownload size="15" />{" "}
                    <span style={{ color: "#000" }}>Download</span>
                  </a>
                  {(authentication.currentRole === 'Administrator') && (<Button
                    size="sm"
                    color="link"
                    onClick={() => toggleUpdate(row.id)}
                  >
                    <MdModeEdit size="15" />{" "}
                    <span style={{ color: "#000" }}>Status</span>
                  </Button>)}
                </div>
              ),
            }))}
            title="Downloads"
          />
        </Col>
      </Row>
      <Modal isOpen={modal} backdrop={true}>
        <Form onSubmit={handleStatus}>
          <ModalHeader>Update Status</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="status">Status</Label>
              <Input
                type="select"
                name="status"
                id="status"
                placeholder="status"
                value={values.status}
                onChange={handleInputChange}
              >
                <option value=""> </option>
                {status.map(({ name, id }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              onClick={() => toggleUpdate(templateId)}
            >
              Save
            </Button>
            <Button
              onClick={() => toggleUpdate(templateId)}
            >
              <span style={{ textTransform: "capitalize" }}>
                Cancel
                      </span>
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Page>
  );
}

const mapStateToProps = (state) => {
  return {
    templates: state.templates.list,
    template: state.templates.template
  };
};

const mapActionToProps = {
  fetchTemplates: fetchAll,
  getTemplate: getById,
  updateStatus: updateStatus,

};

export default connect(mapStateToProps, mapActionToProps)(TemplateDownloadPage);
